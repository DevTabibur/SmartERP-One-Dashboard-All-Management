import React, { forwardRef, HTMLAttributes, useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
}

export interface DrawerTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ 
    className, 
    open = false, 
    onOpenChange, 
    position = 'right',
    size = 'md',
    children, 
    showOverlay = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    preventScroll = true,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    useEffect(() => {
      if (preventScroll && isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'unset';
        };
      }
    }, [isOpen, preventScroll]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape' && isOpen) {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen, closeOnEscape]);

    const handleClose = () => {
      setIsOpen(false);
      onOpenChange?.(false);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        handleClose();
      }
    };

    const positionClasses = {
      left: 'left-0 top-0 h-full',
      right: 'right-0 top-0 h-full',
      top: 'top-0 left-0 w-full',
      bottom: 'bottom-0 left-0 w-full'
    };

    const sizeClasses = {
      sm: position === 'left' || position === 'right' ? 'w-80' : 'h-80',
      md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
      lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
      xl: position === 'left' || position === 'right' ? 'w-[40rem]' : 'h-[40rem]',
      full: position === 'left' || position === 'right' ? 'w-full' : 'h-full'
    };

    const transformClasses = {
      left: isOpen ? 'translate-x-0' : '-translate-x-full',
      right: isOpen ? 'translate-x-0' : 'translate-x-full',
      top: isOpen ? 'translate-y-0' : '-translate-y-full',
      bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 z-50', className)}
        {...props}
      >
        {/* Overlay */}
        {showOverlay && (
          <div
            className={cn(
              'absolute inset-0 bg-black/50 backdrop-blur-sm',
              'transition-opacity duration-300',
              isOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={handleOverlayClick}
          />
        )}

        {/* Drawer */}
        <div
          ref={drawerRef}
          className={cn(
            'absolute bg-white dark:bg-gray-900 shadow-2xl',
            'transition-transform duration-300 ease-in-out',
            positionClasses[position],
            sizeClasses[size],
            transformClasses[position]
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <div
          className={cn('cursor-pointer', className)}
          role="button"
          tabIndex={0}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
          'disabled:pointer-events-none ring-offset-background',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col h-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, showCloseButton = true, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-4 border-b border-gray-200',
          'dark:border-gray-700',
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'transition-colors'
            )}
            aria-label="Close drawer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 p-4 overflow-y-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-2 p-4 border-t border-gray-200',
          'dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Drawer.displayName = 'Drawer';
DrawerTrigger.displayName = 'DrawerTrigger';
DrawerContent.displayName = 'DrawerContent';
DrawerHeader.displayName = 'DrawerHeader';
DrawerBody.displayName = 'DrawerBody';
DrawerFooter.displayName = 'DrawerFooter';

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
};

export default Drawer;
