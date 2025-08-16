import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  persistent?: boolean;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ 
    className,
    open,
    onOpenChange,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    persistent = false,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (open) {
        setIsVisible(true);
        setIsAnimating(true);
        document.body.style.overflow = 'hidden';
      } else {
        setIsAnimating(false);
        const timer = setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = 'unset';
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [open]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape && !persistent) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, closeOnEscape, persistent, onOpenChange]);

    if (!isVisible) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    };

    const handleBackdropClick = () => {
      if (closeOnBackdrop && !persistent) {
        onOpenChange(false);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          className
        )}
        {...props}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-150',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />
        
        {/* Dialog */}
        <div
          className={cn(
            'relative w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl transition-all duration-150',
            sizeClasses[size],
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

Dialog.displayName = 'Dialog';

// Dialog Header Component
export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between p-6 pb-4', className)}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

// Dialog Content Component
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

// Dialog Footer Component
export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, justify = 'end', children, ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700',
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';

// Dialog Close Button Component
export interface DialogCloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

export const DialogCloseButton = forwardRef<HTMLButtonElement, DialogCloseButtonProps>(
  ({ className, onClose, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200',
          className
        )}
        onClick={onClose}
        {...props}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    );
  }
);

DialogCloseButton.displayName = 'DialogCloseButton';

export default Dialog;
