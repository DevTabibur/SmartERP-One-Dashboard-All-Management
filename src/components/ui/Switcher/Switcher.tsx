import React, { forwardRef, HTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SwitcherOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SwitcherOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'outlined' | 'filled' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  showIcons?: boolean;
  showLabels?: boolean;
}

const Switcher = forwardRef<HTMLDivElement, SwitcherProps>(
  ({
    className,
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    disabled = false,
    showIcons = true,
    showLabels = true,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.value || '');
    
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    useEffect(() => {
      if (defaultValue && !isControlled) {
        setInternalValue(defaultValue);
      }
    }, [defaultValue, isControlled]);

    const handleOptionClick = (optionValue: string) => {
      if (disabled || options.find(opt => opt.value === optionValue)?.disabled) {
        return;
      }

      if (!isControlled) {
        setInternalValue(optionValue);
      }
      
      onChange?.(optionValue);
    };

    const variantClasses = {
      default: 'bg-gray-100 dark:bg-gray-800',
      outlined: 'border border-gray-300 dark:border-gray-600 bg-transparent',
      filled: 'bg-gray-50 dark:bg-gray-700',
      pill: 'bg-gray-100 dark:bg-gray-800 rounded-full'
    };

    const sizeClasses = {
      sm: 'h-8 px-1',
      md: 'h-10 px-1',
      lg: 'h-12 px-2'
    };

    const optionSizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const activeClasses = {
      default: 'bg-white dark:bg-gray-900 shadow-sm',
      outlined: 'bg-white dark:bg-gray-900 border-blue-500 dark:border-blue-400',
      filled: 'bg-white dark:bg-gray-900 shadow-sm',
      pill: 'bg-white dark:bg-gray-900 shadow-sm'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex rounded-lg p-1 transition-all duration-200',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const isActive = option.value === currentValue;
          const isOptionDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              disabled={isOptionDisabled}
              className={cn(
                'relative flex items-center justify-center transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                'disabled:cursor-not-allowed',
                optionSizeClasses[size],
                isActive ? activeClasses[variant] : 'text-gray-600 dark:text-gray-400',
                isActive && 'text-gray-900 dark:text-gray-100',
                !isActive && !isOptionDisabled && 'hover:text-gray-900 dark:hover:text-gray-100',
                variant === 'pill' ? 'rounded-full' : 'rounded-md'
              )}
            >
              {showIcons && option.icon && (
                <span className={cn(
                  'mr-2',
                  size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
                )}>
                  {option.icon}
                </span>
              )}
              
              {showLabels && (
                <span className="font-medium whitespace-nowrap">
                  {option.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

Switcher.displayName = 'Switcher';

export default Switcher;
