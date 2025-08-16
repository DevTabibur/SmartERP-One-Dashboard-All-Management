import React, { forwardRef, useState, HTMLAttributes } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  ring?: boolean;
  ringColor?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    src,
    alt,
    fallback,
    size = 'md',
    shape = 'circle',
    status,
    bordered = false,
    ring = false,
    ringColor = 'primary',
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
      '2xl': 'h-20 w-20 text-xl',
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md',
      rounded: 'rounded-lg',
    };

    const statusColors = {
      online: 'bg-green-400 dark:bg-green-500',
      offline: 'bg-gray-400 dark:bg-gray-500',
      away: 'bg-yellow-400 dark:bg-yellow-500',
      busy: 'bg-red-400 dark:bg-red-500',
    };

    const ringColors = {
      primary: 'ring-2 ring-blue-500 dark:ring-blue-400',
      success: 'ring-2 ring-green-500 dark:ring-green-400',
      warning: 'ring-2 ring-yellow-500 dark:ring-yellow-400',
      error: 'ring-2 ring-red-500 dark:ring-red-400',
      gray: 'ring-2 ring-gray-500 dark:ring-gray-400',
    };

    const borderClasses = bordered ? 'border-2 border-white dark:border-gray-800' : '';
    const ringClasses = ring ? ringColors[ringColor] : '';

    const showImage = src && !imageError;
    const showFallback = !showImage && fallback;
    const showDefaultIcon = !showImage && !showFallback;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block',
          sizeClasses[size],
          shapeClasses[shape],
          borderClasses,
          ringClasses,
          className
        )}
        {...props}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={cn(
              'h-full w-full object-cover',
              shapeClasses[shape]
            )}
            onError={() => setImageError(true)}
          />
        )}

        {showFallback && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium',
              shapeClasses[shape]
            )}
          >
            {fallback}
          </div>
        )}

        {showDefaultIcon && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500',
              shapeClasses[shape]
            )}
          >
            <UserIcon className="h-1/2 w-1/2" />
          </div>
        )}

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800',
              statusColors[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group Component
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, size = 'md', spacing = 'normal', ...props }, ref) => {
    const spacingClasses = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: '-space-x-3',
    };

    const childrenArray = React.Children.toArray(children);
    const displayCount = max ? Math.min(max, childrenArray.length) : childrenArray.length;
    const hiddenCount = childrenArray.length - displayCount;

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
        {...props}
      >
        {childrenArray.slice(0, displayCount).map((child, index) => (
          <div key={index} className="relative">
            {React.cloneElement(child as React.ReactElement, { size  })}
          </div>
        ))}

        {hiddenCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium border-2 border-white dark:border-gray-800',
              size === 'xs' && 'h-6 w-6 text-xs',
              size === 'sm' && 'h-8 w-8 text-sm',
              size === 'md' && 'h-10 w-10 text-sm',
              size === 'lg' && 'h-12 w-12 text-base',
              size === 'xl' && 'h-16 w-16 text-lg',
              size === '2xl' && 'h-20 w-20 text-xl',
              'rounded-full'
            )}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
