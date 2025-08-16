import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  fullWidth?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    size = 'md', 
    variant = 'default',
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const [isChecked, setIsChecked] = useState(props.checked || props.defaultChecked || false);

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const variantClasses = {
      default: 'border-gray-300 bg-white text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700',
      outlined: 'border-2 border-gray-300 bg-transparent text-blue-600 focus:ring-blue-500 dark:border-gray-600',
      filled: 'border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800'
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        setIsChecked(e.target.checked);
        props.onChange?.(e);
      }
    };

    return (
      <div className={cn('flex items-start', fullWidth && 'w-full', className)}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            className={cn(
              'sr-only'
            )}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full border transition-all duration-200',
              'focus-within:ring-2 focus-within:ring-offset-2',
              'dark:focus-within:ring-offset-gray-900',
              sizeClasses[size],
              variantClasses[variant],
              error && 'border-red-500 focus-within:ring-red-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            onClick={() => {
              if (!disabled) {
                setIsChecked(!isChecked);
              }
            }}
            role="radio"
            aria-checked={isChecked}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (!disabled) {
                  setIsChecked(!isChecked);
                }
              }
            }}
          >
            {isChecked && (
              <div className={cn(
                'bg-current rounded-full',
                size === 'sm' && 'h-1.5 w-1.5',
                size === 'md' && 'h-2 w-2',
                size === 'lg' && 'h-2.5 w-2.5'
              )} />
            )}
          </div>
        </div>
        
        {(label || helperText || error) && (
          <div className="ml-3 text-sm">
            {label && (
              <label
                className={cn(
                  'font-medium text-gray-700 dark:text-gray-300',
                  labelSizeClasses[size],
                  error && 'text-red-600 dark:text-red-400',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => {
                  if (!disabled) {
                    setIsChecked(!isChecked);
                  }
                }}
              >
                {label}
              </label>
            )}
            {helperText && !error && (
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
            {error && (
              <p className="mt-1 text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ 
    className, 
    children, 
    value,
    onChange,
    name,
    disabled = false,
    orientation = 'vertical',
    ...props 
  }, ref) => {
    const orientationClasses = {
      horizontal: 'flex flex-row flex-wrap gap-4',
      vertical: 'flex flex-col space-y-3'
    };

    const handleRadioChange = (radioValue: string) => {
      if (!disabled && onChange) {
        onChange(radioValue);
      }
    };

    // Clone children and pass down the group props
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Radio) {
        return React.cloneElement(child, {
          name,
          checked: child.props.value === value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleRadioChange(e.target.value);
            child.props.onChange?.(e);
          },
          disabled: disabled || child.props.disabled
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-3',
          orientationClasses[orientation],
          className
        )}
        role="radiogroup"
        aria-label={name}
        {...props}
      >
        {enhancedChildren}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };
export default Radio;
