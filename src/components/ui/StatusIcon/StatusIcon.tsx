import React, { forwardRef, HTMLAttributes } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface StatusIconProps extends HTMLAttributes<HTMLDivElement> {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'paused' | 'running' | 'stopped';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  pulse?: boolean;
}

const StatusIcon = forwardRef<HTMLDivElement, StatusIconProps>(
  ({ 
    className, 
    status,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    animated = false,
    pulse = false,
    ...props 
  }, ref) => {
    const statusConfig = {
      success: {
        icon: CheckCircleIcon,
        colors: {
          default: 'text-green-500 dark:text-green-400',
          filled: 'bg-green-500 text-white dark:bg-green-400 dark:text-gray-900',
          outlined: 'border-2 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400',
          minimal: 'text-green-600 dark:text-green-400'
        },
        label: 'Success'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        colors: {
          default: 'text-yellow-500 dark:text-yellow-400',
          filled: 'bg-yellow-500 text-white dark:bg-yellow-400 dark:text-gray-900',
          outlined: 'border-2 border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400',
          minimal: 'text-yellow-600 dark:text-yellow-400'
        },
        label: 'Warning'
      },
      error: {
        icon: XCircleIcon,
        colors: {
          default: 'text-red-500 dark:text-red-400',
          filled: 'bg-red-500 text-white dark:bg-red-400 dark:text-gray-900',
          outlined: 'border-2 border-red-500 text-red-500 dark:border-red-400 dark:text-red-400',
          minimal: 'text-red-600 dark:text-red-400'
        },
        label: 'Error'
      },
      info: {
        icon: InformationCircleIcon,
        colors: {
          default: 'text-blue-500 dark:text-blue-400',
          filled: 'bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900',
          outlined: 'border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400',
          minimal: 'text-blue-600 dark:text-blue-400'
        },
        label: 'Info'
      },
      pending: {
        icon: ClockIcon,
        colors: {
          default: 'text-gray-500 dark:text-gray-400',
          filled: 'bg-gray-500 text-white dark:bg-gray-400 dark:text-gray-900',
          outlined: 'border-2 border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400',
          minimal: 'text-gray-600 dark:text-gray-400'
        },
        label: 'Pending'
      },
      paused: {
        icon: PauseIcon,
        colors: {
          default: 'text-orange-500 dark:text-orange-400',
          filled: 'bg-orange-500 text-white dark:bg-orange-400 dark:text-gray-900',
          outlined: 'border-2 border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400',
          minimal: 'text-orange-600 dark:text-orange-400'
        },
        label: 'Paused'
      },
      running: {
        icon: PlayIcon,
        colors: {
          default: 'text-green-500 dark:text-green-400',
          filled: 'bg-green-500 text-white dark:bg-green-400 dark:text-gray-900',
          outlined: 'border-2 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400',
          minimal: 'text-green-600 dark:text-green-400'
        },
        label: 'Running'
      },
      stopped: {
        icon: StopIcon,
        colors: {
          default: 'text-red-500 dark:text-red-400',
          filled: 'bg-red-500 text-white dark:bg-red-400 dark:text-gray-900',
          outlined: 'border-2 border-red-500 text-red-500 dark:border-red-400 dark:text-red-400',
          minimal: 'text-red-600 dark:text-red-400'
        },
        label: 'Stopped'
      }
    };

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    };

    const containerSizeClasses = {
      sm: 'p-1',
      md: 'p-1.5',
      lg: 'p-2',
      xl: 'p-3'
    };

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    const currentStatus = statusConfig[status];
    const IconComponent = currentStatus.icon;
    const colors = currentStatus.colors[variant];
    const displayLabel = label || currentStatus.label;

    const iconClasses = cn(
      sizeClasses[size],
      variant === 'filled' && 'text-white dark:text-gray-900',
      variant === 'outlined' && 'text-current',
      variant === 'minimal' && 'text-current',
      variant === 'default' && colors,
      animated && 'animate-spin',
      pulse && 'animate-pulse'
    );

    const containerClasses = cn(
      'inline-flex items-center justify-center rounded-full transition-colors duration-200',
      variant === 'filled' && colors,
      variant === 'outlined' && 'bg-transparent',
      variant === 'minimal' && 'bg-transparent',
      variant === 'default' && 'bg-transparent',
      containerSizeClasses[size],
      className
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center space-x-2', className)}
        {...props}
      >
        <div className={containerClasses}>
          <IconComponent className={iconClasses} />
        </div>
        
        {showLabel && (
          <span className={cn(
            'font-medium',
            labelSizeClasses[size],
            variant === 'filled' ? 'text-white dark:text-gray-900' : 'text-gray-700 dark:text-gray-300'
          )}>
            {displayLabel}
          </span>
        )}
      </div>
    );
  }
);

// Convenience components for common statuses
const SuccessIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="success" {...props} />
);

const WarningIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="warning" {...props} />
);

const ErrorIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="error" {...props} />
);

const InfoIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="info" {...props} />
);

const PendingIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="pending" {...props} />
);

const PausedIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="paused" {...props} />
);

const RunningIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="running" {...props} />
);

const StoppedIcon = forwardRef<HTMLDivElement, Omit<StatusIconProps, 'status'>>(
  (props, ref) => <StatusIcon ref={ref} status="stopped" {...props} />
);

StatusIcon.displayName = 'StatusIcon';
SuccessIcon.displayName = 'SuccessIcon';
WarningIcon.displayName = 'WarningIcon';
ErrorIcon.displayName = 'ErrorIcon';
InfoIcon.displayName = 'InfoIcon';
PendingIcon.displayName = 'PendingIcon';
PausedIcon.displayName = 'PausedIcon';
RunningIcon.displayName = 'RunningIcon';
StoppedIcon.displayName = 'StoppedIcon';

export {
  StatusIcon,
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  PendingIcon,
  PausedIcon,
  RunningIcon,
  StoppedIcon
};

export default StatusIcon;
