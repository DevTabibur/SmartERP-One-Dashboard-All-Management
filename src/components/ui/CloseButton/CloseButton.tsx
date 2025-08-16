import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'ghost' | 'text';
  rounded?: boolean;
  icon?: React.ReactNode;
}

const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'default',
    rounded = false,
    icon,
    disabled,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10'
    };

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    const variantClasses = {
      default: 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
      outlined: 'border border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800',
      text: 'bg-transparent text-gray-600 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-400 dark:hover:text-gray-100'
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          rounded ? 'rounded-full' : 'rounded-md',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled}
        aria-label="Close"
        {...props}
      >
        {icon || (
          <XMarkIcon 
            className={cn(
              'text-current',
              iconSizeClasses[size]
            )} 
          />
        )}
      </button>
    );
  }
);

CloseButton.displayName = 'CloseButton';

export default CloseButton;
