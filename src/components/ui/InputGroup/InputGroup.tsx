import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  disabled?: boolean;
  error?: boolean;
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  position: 'left' | 'right';
  variant?: 'text' | 'button' | 'icon';
}

export interface InputGroupTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface InputGroupButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
}

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ 
    className, 
    children, 
    size = 'md',
    variant = 'default',
    disabled = false,
    error = false,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const variantClasses = {
      default: 'border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500',
      outlined: 'border-2 border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500',
      filled: 'border-gray-300 bg-gray-50 focus-within:border-blue-500 focus-within:ring-blue-500 dark:bg-gray-700'
    };

    const errorClasses = 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500';
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
      <div
        ref={ref}
        className={cn(
          'flex rounded-md shadow-sm',
          'focus-within:ring-1 focus-within:ring-offset-0',
          'dark:focus-within:ring-offset-gray-900',
          sizeClasses[size],
          error ? errorClasses : variantClasses[variant],
          disabled && disabledClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, children, position, variant = 'text', ...props }, ref) => {
    const positionClasses = {
      left: 'rounded-l-md border-r-0',
      right: 'rounded-r-md border-l-0'
    };

    const variantClasses = {
      text: 'bg-gray-50 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
      button: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700',
      icon: 'bg-gray-50 text-gray-400 border-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 border',
          'text-sm font-medium',
          positionClasses[position],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const InputGroupText = forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, children, disabled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          'inline-flex items-center px-3 py-2 border border-gray-300',
          'bg-gray-100 text-gray-700 text-sm font-medium',
          'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700',
          'dark:focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

InputGroup.displayName = 'InputGroup';
InputGroupAddon.displayName = 'InputGroupAddon';
InputGroupText.displayName = 'InputGroupText';
InputGroupButton.displayName = 'InputGroupButton';

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupButton };
export default InputGroup;
