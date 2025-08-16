import React, { forwardRef, HTMLAttributes, createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
  required?: boolean;
  validator?: (value: any) => string | undefined;
}

export interface FormContextType {
  fields: Record<string, FormField>;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  getFieldValue: (name: string) => any;
  getFieldError: (name: string) => string | undefined;
  isFieldTouched: (name: string) => boolean;
}

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form');
  }
  return context;
};

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  children: ReactNode;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export interface FormFieldErrorProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
}

export interface FormFieldHelperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ 
    className, 
    children, 
    initialValues = {},
    onSubmit,
    onValidationError,
    validateOnChange = true,
    validateOnBlur = true,
    ...props 
  }, ref) => {
    const [fields, setFields] = useState<Record<string, FormField>>(() => {
      const initialFields: Record<string, FormField> = {};
      Object.entries(initialValues).forEach(([name, value]) => {
        initialFields[name] = {
          name,
          value,
          touched: false,
          required: false,
        };
      });
      return initialFields;
    });

    const setFieldValue = (name: string, value: any) => {
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          name,
          value,
        }
      }));

      if (validateOnChange) {
        validateField(name);
      }
    };

    const setFieldError = (name: string, error: string) => {
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          name,
          error,
        }
      }));
    };

    const setFieldTouched = (name: string, touched: boolean) => {
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          name,
          touched,
        }
      }));

      if (validateOnBlur && touched) {
        validateField(name);
      }
    };

    const validateField = (name: string) => {
      const field = fields[name];
      if (!field) return;

      let error: string | undefined;

      // Required validation
      if (field.required && (!field.value || field.value === '')) {
        error = 'This field is required';
      }

      // Custom validator
      if (!error && field.validator) {
        error = field.validator(field.value);
      }

      setFieldError(name, error || '');
    };

    const validateForm = (): boolean => {
      const errors: Record<string, string> = {};
      let isValid = true;

      Object.values(fields).forEach(field => {
        validateField(field.name);
        if (fields[field.name].error) {
          errors[field.name] = fields[field.name].error!;
          isValid = false;
        }
      });

      if (!isValid && onValidationError) {
        onValidationError(errors);
      }

      return isValid;
    };

    const resetForm = () => {
      setFields(prev => {
        const resetFields: Record<string, FormField> = {};
        Object.entries(prev).forEach(([name, field]) => {
          resetFields[name] = {
            ...field,
            value: initialValues[name] || '',
            error: undefined,
            touched: false,
          };
        });
        return resetFields;
      });
    };

    const getFieldValue = (name: string) => {
      return fields[name]?.value;
    };

    const getFieldError = (name: string) => {
      return fields[name]?.error;
    };

    const isFieldTouched = (name: string) => {
      return fields[name]?.touched || false;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm() && onSubmit) {
        const values: Record<string, any> = {};
        Object.entries(fields).forEach(([name, field]) => {
          values[name] = field.value;
        });
        onSubmit(values);
      }
    };

    const contextValue: FormContextType = {
      fields,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      validateField,
      validateForm,
      resetForm,
      getFieldValue,
      getFieldError,
      isFieldTouched,
    };

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn('space-y-6', className)}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, name, children, label, required = false, helperText, error, ...props }, ref) => {
    const { setFieldTouched } = useForm();

    const handleBlur = () => {
      setFieldTouched(name, true);
    };

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        onBlur={handleBlur}
        {...props}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {children}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

const FormFieldError = forwardRef<HTMLDivElement, FormFieldErrorProps>(
  ({ className, name, ...props }, ref) => {
    const { getFieldError } = useForm();
    const error = getFieldError(name);

    if (!error) return null;

    return (
      <div
        ref={ref}
        className={cn('text-sm text-red-600 dark:text-red-400', className)}
        {...props}
      >
        {error}
      </div>
    );
  }
 );

const FormFieldHelper = forwardRef<HTMLDivElement, FormFieldHelperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Form.displayName = 'Form';
FormField.displayName = 'FormField';
FormFieldError.displayName = 'FormFieldError';
FormFieldHelper.displayName = 'FormFieldHelper';

export { Form, FormField, FormFieldError, FormFieldHelper };
export default Form;
