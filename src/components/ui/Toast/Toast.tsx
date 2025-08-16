import React, {
  forwardRef,
  HTMLAttributes,
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useRef,
} from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  maxToasts?: number;
  autoClose?: boolean;
  defaultDuration?: number;
}

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  toast: Toast;
  onClose: (id: string) => void;
  position: string;
}

export interface ToastContainerProps extends HTMLAttributes<HTMLDivElement> {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
  autoClose = true,
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    setToasts((prev) => {
      const updatedToasts = [newToast, ...prev].slice(0, maxToasts);
      return updatedToasts;
    });

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} />
    </ToastContext.Provider>
  );
};

const ToastContainer = forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ className, position = 'top-right', ...props }, ref) => {
    const { toasts, removeToast } = useToast();

    const positionClasses: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onClose={removeToast}
            position={position}
          />
        ))}
      </div>
    );
  }
);

const ToastComponent = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, toast, onClose, position, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      // Animate in
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (toast.duration && toast.duration > 0) {
        closeTimeout.current = setTimeout(() => {
          handleClose();
        }, toast.duration);

        return () => {
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
        };
      }
    }, [toast.duration]);

    const handleClose = () => {
      setIsLeaving(true);
      setTimeout(() => {
        onClose(toast.id);
        toast.onClose?.();
      }, 300);
    };

    const getTypeClasses = () => {
      const baseClasses =
        'flex items-start p-4 rounded-lg shadow-lg border border-l-4 min-w-80 max-w-sm';

      const typeClasses: Record<string, string> = {
        success:
          'bg-green-50 border-green-200 border-l-green-500 dark:bg-green-900/20 dark:border-green-800 dark:border-l-green-400',
        error:
          'bg-red-50 border-red-200 border-l-red-500 dark:bg-red-900/20 dark:border-red-800 dark:border-l-red-400',
        warning:
          'bg-yellow-50 border-yellow-200 border-l-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-800 dark:border-l-yellow-400',
        info:
          'bg-blue-50 border-blue-200 border-l-blue-500 dark:bg-blue-900/20 dark:border-blue-800 dark:border-l-blue-400',
        default:
          'bg-white border-gray-200 border-l-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-gray-400',
      };

      return cn(baseClasses, typeClasses[toast.type || 'default']);
    };

    const getTypeIcon = () => {
      const iconClasses = 'h-5 w-5 flex-shrink-0';

      switch (toast.type) {
        case 'success':
          return (
            <CheckCircleIcon className={cn(iconClasses, 'text-green-500')} />
          );
        case 'error':
          return <XCircleIcon className={cn(iconClasses, 'text-red-500')} />;
        case 'warning':
          return (
            <ExclamationTriangleIcon
              className={cn(iconClasses, 'text-yellow-500')}
            />
          );
        case 'info':
          return (
            <InformationCircleIcon className={cn(iconClasses, 'text-blue-500')} />
          );
        default:
          return (
            <InformationCircleIcon className={cn(iconClasses, 'text-gray-500')} />
          );
      }
    };

    const getTypeTextColor = () => {
      const textClasses: Record<string, string> = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
        info: 'text-blue-800 dark:text-blue-200',
        default: 'text-gray-800 dark:text-gray-200',
      };

      return textClasses[toast.type || 'default'];
    };

    const getTypeDescriptionColor = () => {
      const descriptionClasses: Record<string, string> = {
        success: 'text-green-600 dark:text-green-300',
        error: 'text-red-600 dark:text-red-300',
        warning: 'text-yellow-600 dark:text-yellow-300',
        info: 'text-blue-600 dark:text-blue-300',
        default: 'text-gray-600 dark:text-gray-300',
      };

      return descriptionClasses[toast.type || 'default'];
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transform transition-all duration-300 ease-in-out',
          isVisible && !isLeaving
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95',
          position.includes('left') && !isVisible && '-translate-x-full',
          position.includes('right') && !isVisible && 'translate-x-full',
          className
        )}
        {...props}
      >
        <div className={getTypeClasses()}>
          {/* Icon */}
          <div className="flex-shrink-0 mr-3">{getTypeIcon()}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-medium', getTypeTextColor())}>
              {toast.title}
            </h4>

            {toast.description && (
              <p className={cn('mt-1 text-sm', getTypeDescriptionColor())}>
                {toast.description}
              </p>
            )}

            {/* Action Button */}
            {toast.action && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={toast.action.onClick}
                  className={cn(
                    'text-sm font-medium underline-offset-4 hover:underline',
                    getTypeTextColor()
                  )}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'ml-3 flex-shrink-0 rounded-md p-1.5',
              'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'dark:focus:ring-offset-gray-900',
              'transition-colors duration-200'
            )}
            aria-label="Close toast"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';
ToastComponent.displayName = 'ToastComponent';

// export { ToastProvider, useToast };
// export default ToastProvider;
