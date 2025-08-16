import React, { forwardRef, useState, useEffect, HTMLAttributes } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message?: string;
  duration?: number;
  showCloseButton?: boolean;
  onClose?: () => void;
  onAction?: () => void;
  actionText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export interface NotificationContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    className, 
    type = 'info',
    title,
    message,
    duration = 5000,
    showCloseButton = true,
    onClose,
    onAction,
    actionText,
    icon,
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    };

    const typeConfig = {
      success: {
        icon: CheckCircleIcon,
        colors: {
          default: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
          filled: 'bg-green-500 text-white border-green-500',
          outlined: 'bg-transparent text-green-600 border-green-300 dark:text-green-400 dark:border-green-600'
        }
      },
      warning: {
        icon: ExclamationTriangleIcon,
        colors: {
          default: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
          filled: 'bg-yellow-500 text-white border-yellow-500',
          outlined: 'bg-transparent text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600'
        }
      },
      error: {
        icon: XCircleIcon,
        colors: {
          default: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
          filled: 'bg-red-500 text-white border-red-500',
          outlined: 'bg-transparent text-red-600 border-red-300 dark:text-red-400 dark:border-red-600'
        }
      },
      info: {
        icon: InformationCircleIcon,
        colors: {
          default: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
          filled: 'bg-blue-500 text-white border-blue-500',
          outlined: 'bg-transparent text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600'
        }
      }
    };

    const sizeClasses = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-5 text-lg'
    };

    const IconComponent = icon || typeConfig[type].icon;
    const colors = typeConfig[type].colors[variant];

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'relative border rounded-lg shadow-lg transition-all duration-300 ease-in-out',
          'transform',
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
          sizeClasses[size],
          colors,
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={cn(
              'h-5 w-5',
              size === 'lg' && 'h-6 w-6'
            )} />
          </div>
          
          <div className="ml-3 flex-1">
            {title && (
              <h4 className={cn(
                'font-medium',
                size === 'lg' && 'text-lg'
              )}>
                {title}
              </h4>
            )}
            
            {message && (
              <p className={cn(
                'mt-1',
                title && 'mt-2'
              )}>
                {message}
              </p>
            )}
            
            {onAction && actionText && (
              <button
                onClick={onAction}
                className={cn(
                  'mt-3 text-sm font-medium underline hover:no-underline',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
                  variant === 'filled' ? 'focus:ring-white' : 'focus:ring-current'
                )}
              >
                {actionText}
              </button>
            )}
          </div>
          
          {showCloseButton && (
            <button
              onClick={handleClose}
              className={cn(
                'ml-4 flex-shrink-0 rounded-md p-1.5',
                'hover:bg-black/10 dark:hover:bg-white/10',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'filled' ? 'focus:ring-white' : 'focus:ring-current'
              )}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

const NotificationContainer = forwardRef<HTMLDivElement, NotificationContainerProps>(
  ({ 
    className, 
    children, 
    position = 'top-right',
    maxNotifications = 5,
    ...props 
  }, ref) => {
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 space-y-3 max-w-sm w-full',
          positionClasses[position],
          className
        )}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
        {...props}
      >
        {React.Children.toArray(children).slice(0, maxNotifications)}
      </div>
    );
  }
);

Notification.displayName = 'Notification';
NotificationContainer.displayName = 'NotificationContainer';

export { Notification, NotificationContainer };
export default Notification;
