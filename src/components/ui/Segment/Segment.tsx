import React, { forwardRef, useState, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  fullWidth?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Segment = forwardRef<HTMLDivElement, SegmentProps>(
  ({ 
    className, 
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    size = 'md',
    variant = 'default',
    fullWidth = false,
    disabled = false,
    orientation = 'horizontal',
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const buttonSizeClasses = {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3'
    };

    const variantClasses = {
      default: {
        container: 'bg-gray-100 dark:bg-gray-800 p-1',
        button: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
        active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
      },
      outlined: {
        container: 'border border-gray-300 dark:border-gray-600 p-1',
        button: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
        active: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
      },
      filled: {
        container: 'bg-gray-200 dark:bg-gray-700 p-1',
        button: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
        active: 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
      },
      minimal: {
        container: 'p-1',
        button: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
        active: 'text-blue-600 dark:text-blue-400 font-medium'
      }
    };

    const orientationClasses = {
      horizontal: 'flex flex-row',
      vertical: 'flex flex-col'
    };

    const handleOptionClick = (optionValue: string) => {
      if (disabled || controlledValue !== undefined) return;
      
      setInternalValue(optionValue);
      onChange?.(optionValue);
    };

    const currentVariant = variantClasses[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientationClasses[orientation],
          currentVariant.container,
          'rounded-lg',
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {options.map((option, index) => {
          const isActive = option.value === value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          const buttonClasses = cn(
            'relative flex items-center justify-center font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'dark:focus:ring-offset-gray-900',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            buttonSizeClasses[size],
            sizeClasses[size],
            currentVariant.button,
            isActive && currentVariant.active,
            option.disabled && 'opacity-50 cursor-not-allowed',
            orientation === 'horizontal' && [
              isFirst && 'rounded-l-md',
              isLast && 'rounded-r-md'
            ],
            orientation === 'vertical' && [
              isFirst && 'rounded-t-md',
              isLast && 'rounded-b-md'
            ]
          );

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || option.disabled}
              onClick={() => handleOptionClick(option.value)}
              className={buttonClasses}
              role="radio"
              aria-checked={isActive}
              aria-label={option.label}
            >
              {option.icon && (
                <span className={cn(
                  'mr-2',
                  size === 'sm' && 'h-4 w-4',
                  size === 'md' && 'h-5 w-5',
                  size === 'lg' && 'h-6 w-6'
                )}>
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }
);

Segment.displayName = 'Segment';

export default Segment;
