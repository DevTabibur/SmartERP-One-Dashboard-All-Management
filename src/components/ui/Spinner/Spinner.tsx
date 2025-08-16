import { cn } from '@/lib/utils/cn';
import React, { forwardRef, HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  thickness?: 'thin' | 'normal' | 'thick';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ 
    className,
    size = 'md',
    variant = 'default',
    thickness = 'normal',
    speed = 'normal',
    label,
    labelPosition = 'bottom',
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const thicknessClasses = {
      thin: 'border',
      normal: 'border-2',
      thick: 'border-4',
    };

    const variantClasses = {
      default: 'border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400',
      primary: 'border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400',
      success: 'border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400',
      warning: 'border-yellow-200 dark:border-yellow-800 border-t-yellow-600 dark:border-t-yellow-400',
      error: 'border-red-200 dark:border-red-800 border-t-red-600 dark:border-t-red-400',
      info: 'border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400',
    };

    const speedClasses = {
      slow: 'animate-spin',
      normal: 'animate-spin',
      fast: 'animate-spin',
    };

    const speedDurations = {
      slow: 'duration-1000',
      normal: 'duration-700',
      fast: 'duration-500',
    };

    const labelSizeClasses = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base',
    };

    const labelPositionClasses = {
      top: 'mb-2',
      bottom: 'mt-2',
      left: 'mr-2',
      right: 'ml-2',
    };

    const containerClasses = cn(
      'inline-flex items-center justify-center',
      labelPosition === 'left' || labelPosition === 'right' ? 'flex-row' : 'flex-col',
      className
    );

    const spinnerClasses = cn(
      'rounded-full',
      sizeClasses[size],
      thicknessClasses[thickness],
      variantClasses[variant],
      speedClasses[speed],
      speedDurations[speed]
    );

    const labelClasses = cn(
      'text-gray-600 dark:text-gray-400 font-medium',
      labelSizeClasses[size],
      labelPositionClasses[labelPosition],
      labelPosition === 'left' || labelPosition === 'right' ? 'whitespace-nowrap' : ''
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {label && labelPosition === 'top' && (
          <span className={labelClasses}>{label}</span>
        )}
        
        {label && labelPosition === 'left' && (
          <span className={labelClasses}>{label}</span>
        )}
        
        <div className={spinnerClasses} />
        
        {label && labelPosition === 'right' && (
          <span className={labelClasses}>{label}</span>
        )}
        
        {label && labelPosition === 'bottom' && (
          <span className={labelClasses}>{label}</span>
        )}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
