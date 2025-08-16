import { cn } from '@/lib/utils/cn';
import React, { forwardRef, HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  animated?: boolean;
  striped?: boolean;
  rounded?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className,
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    showLabel = false,
    labelPosition = 'top',
    animated = false,
    striped = false,
    rounded = true,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };

    const variantClasses = {
      default: 'bg-blue-600 dark:bg-blue-500',
      success: 'bg-green-600 dark:bg-green-500',
      warning: 'bg-yellow-600 dark:bg-yellow-500',
      error: 'bg-red-600 dark:bg-red-500',
      info: 'bg-blue-600 dark:bg-blue-500',
    };

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const labelPositionClasses = {
      top: 'mb-2',
      bottom: 'mt-2',
      left: 'mr-2',
      right: 'ml-2',
    };

    const progressBarClasses = cn(
      'transition-all duration-300 ease-out',
      sizeClasses[size],
      rounded ? 'rounded-full' : 'rounded-none',
      'bg-gray-200 dark:bg-gray-700',
      'overflow-hidden'
    );

    const progressFillClasses = cn(
      'h-full transition-all duration-300 ease-out',
      variantClasses[variant],
      rounded ? 'rounded-full' : 'rounded-none',
      animated && 'animate-pulse',
      striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-pulse'
    );

    const containerClasses = cn(
      'w-full',
      labelPosition === 'left' || labelPosition === 'right' ? 'flex items-center' : 'block',
      className
    );

    const labelClasses = cn(
      'font-medium text-gray-700 dark:text-gray-300',
      labelSizeClasses[size],
      labelPositionClasses[labelPosition],
      labelPosition === 'left' || labelPosition === 'right' ? 'whitespace-nowrap' : ''
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {showLabel && labelPosition === 'top' && (
          <div className="flex justify-between items-center mb-2">
            <span className={labelClasses}>Progress</span>
            <span className={cn(labelClasses, 'text-gray-500 dark:text-gray-400')}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        {showLabel && labelPosition === 'left' && (
          <span className={labelClasses}>Progress</span>
        )}
        
        <div className={cn('flex-1', labelPosition === 'left' || labelPosition === 'right' ? 'ml-2' : '')}>
          <div className={progressBarClasses}>
            <div
              className={progressFillClasses}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        {showLabel && labelPosition === 'right' && (
          <span className={cn(labelClasses, 'ml-2')}>Progress</span>
        )}
        
        {showLabel && labelPosition === 'bottom' && (
          <div className="flex justify-between items-center mt-2">
            <span className={labelClasses}>Progress</span>
            <span className={cn(labelClasses, 'text-gray-500 dark:text-gray-400')}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;
