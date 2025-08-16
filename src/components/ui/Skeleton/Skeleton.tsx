import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
  lineHeight?: string | number;
  lineSpacing?: string | number;
  show?: boolean;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  lines?: number;
  lineHeight?: string | number;
  lineSpacing?: string | number;
}

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'ghost';
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    lines = 1,
    lineHeight = '1.25rem',
    lineSpacing = '0.5rem',
    show = true,
    ...props 
  }, ref) => {
    if (!show) return null;

    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-pulse',
      none: ''
    };

    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg'
    };

    const baseClasses = cn(
      'bg-gray-200 dark:bg-gray-700',
      animationClasses[animation],
      variantClasses[variant],
      className
    );

    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          className="space-y-2"
          style={{ '--line-spacing': lineSpacing } as React.CSSProperties}
          {...props}
        >
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                baseClasses,
                index === lines - 1 && 'w-3/4' // Last line is shorter
              )}
              style={{
                height: lineHeight,
                width: index === lines - 1 ? '75%' : '100%'
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          width: width || '100%',
          height: height || variant === 'text' ? lineHeight : '1rem'
        }}
        {...props}
      />
    );
  }
);

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ 
    className, 
    lines = 3,
    lineHeight = '1.25rem',
    lineSpacing = '0.5rem',
    ...props 
  }, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="text"
        lines={lines}
        lineHeight={lineHeight}
        lineSpacing={lineSpacing}
        className={className}
        {...props}
      />
    );
  }
);

const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ 
    className, 
    size = 'md',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    return (
      <Skeleton
        ref={ref}
        variant="circular"
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

const SkeletonButton = forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ 
    className, 
    size = 'md',
    variant = 'default',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-8 text-lg'
    };

    const variantClasses = {
      default: 'rounded-md',
      outlined: 'rounded-md border',
      ghost: 'rounded-md'
    };

    return (
      <Skeleton
        ref={ref}
        variant="rounded"
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

const SkeletonCard = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 border border-gray-200 dark:border-gray-700 rounded-lg',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-4 mb-4">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="1rem" />
            <Skeleton width="40%" height="0.875rem" />
          </div>
        </div>
        <div className="space-y-3">
          <SkeletonText lines={2} />
          <Skeleton width="80%" height="1rem" />
        </div>
        <div className="flex justify-between items-center mt-6">
          <Skeleton width="30%" height="1rem" />
          <SkeletonButton size="sm" />
        </div>
      </div>
    );
  }
);

const SkeletonTable = forwardRef<HTMLDivElement, SkeletonProps & { rows?: number; columns?: number }>(
  ({ className, rows = 5, columns = 4, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-3', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex space-x-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              width={index === 0 ? '20%' : index === columns - 1 ? '15%' : '25%'}
              height="1rem"
            />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex space-x-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                width={colIndex === 0 ? '20%' : colIndex === columns - 1 ? '15%' : '25%'}
                height="1rem"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';
SkeletonText.displayName = 'SkeletonText';
SkeletonAvatar.displayName = 'SkeletonAvatar';
SkeletonButton.displayName = 'SkeletonButton';
SkeletonCard.displayName = 'SkeletonCard';
SkeletonTable.displayName = 'SkeletonTable';

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable
};

export default Skeleton;
