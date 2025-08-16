import React, { forwardRef, HTMLAttributes } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant = 'default',
    title,
    description,
    closable = false,
    onClose,
    icon,
    action,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      default: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200',
    };

    const iconClasses = {
      success: 'text-green-400 dark:text-green-300',
      warning: 'text-yellow-400 dark:text-yellow-300',
      error: 'text-red-400 dark:text-red-300',
      info: 'text-blue-400 dark:text-blue-300',
      default: 'text-gray-400 dark:text-gray-300',
    };

    const defaultIcons = {
      success: <CheckCircleIcon className="h-5 w-5" />,
      warning: <ExclamationTriangleIcon className="h-5 w-5" />,
      error: <XCircleIcon className="h-5 w-5" />,
      info: <InformationCircleIcon className="h-5 w-5" />,
      default: <InformationCircleIcon className="h-5 w-5" />,
    };

    const displayIcon = icon || defaultIcons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border p-4 transition-all duration-200',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {displayIcon && (
            <div className={cn('flex-shrink-0', iconClasses[variant])}>
              {displayIcon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}

            {description && (
              <p className="text-sm opacity-90">
                {description}
              </p>
            )}

            {children}
          </div>

          <div className="flex items-center space-x-2">
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}

            {closable && (
              <button
                onClick={onClose}
                className={cn(
                  'flex-shrink-0 rounded-md p-1 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5',
                  iconClasses[variant]
                )}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
