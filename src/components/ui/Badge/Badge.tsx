import { cn } from '@/lib/utils/cn';
import React, { forwardRef, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  dot?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    rounded = 'full',
    dot = false,
    closable = false,
    onClose,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';

    const variantClasses = {
      default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-300',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm',
    };

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const dotColors = {
      default: 'bg-gray-400 dark:bg-gray-500',
      primary: 'bg-blue-400 dark:bg-blue-500',
      secondary: 'bg-gray-400 dark:bg-gray-500',
      success: 'bg-green-400 dark:bg-green-500',
      warning: 'bg-yellow-400 dark:bg-yellow-500',
      error: 'bg-red-400 dark:bg-red-500',
      info: 'bg-blue-400 dark:bg-blue-500',
      outline: 'bg-gray-400 dark:bg-gray-500',
      ghost: 'bg-gray-400 dark:bg-gray-500',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-1.5 w-1.5 rounded-full',
              dotColors[variant]
            )}
          />
        )}

        {children}

        {closable && (
          <button
            onClick={onClose}
            className="ml-1.5 -mr-1 h-4 w-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
