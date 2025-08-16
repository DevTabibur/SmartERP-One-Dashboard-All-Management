import React, { forwardRef, useState, useRef, useEffect, HTMLAttributes } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  showArrow?: boolean;
  closeOnClick?: boolean;
  closeOnEscape?: boolean;
  closeOnBlur?: boolean;
}

export interface MenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
  shortcut?: string;
  variant?: 'default' | 'danger' | 'warning';
}

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface MenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ 
    className, 
    children, 
    trigger,
    open: controlledOpen,
    onOpenChange,
    placement = 'bottom',
    align = 'start',
    offset = 8,
    showArrow = true,
    closeOnClick = true,
    closeOnEscape = true,
    closeOnBlur = true,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : isOpen;

    useEffect(() => {
      if (open) {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition);
        };
      }
    }, [open]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape' && open) {
          handleClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, closeOnEscape]);

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'bottom':
          top = triggerRect.bottom + scrollTop + offset;
          break;
        case 'top':
          top = triggerRect.top + scrollTop - contentRect.height - offset;
          break;
        case 'left':
          top = triggerRect.top + scrollTop;
          left = triggerRect.left + scrollLeft - contentRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + scrollTop;
          left = triggerRect.right + scrollLeft + offset;
          break;
      }

      switch (align) {
        case 'start':
          if (placement === 'left' || placement === 'right') {
            top = triggerRect.top + scrollTop;
          } else {
            left = triggerRect.left + scrollLeft;
          }
          break;
        case 'center':
          if (placement === 'left' || placement === 'right') {
            top = triggerRect.top + scrollTop + (triggerRect.height / 2) - (contentRect.height / 2);
          } else {
            left = triggerRect.left + scrollLeft + (triggerRect.width / 2) - (contentRect.width / 2);
          }
          break;
        case 'end':
          if (placement === 'left' || placement === 'right') {
            top = triggerRect.bottom + scrollTop - contentRect.height;
          } else {
            left = triggerRect.right + scrollLeft - contentRect.width;
          }
          break;
      }

      setPosition({ top, left });
    };

    const handleToggle = () => {
      if (!isControlled) {
        setIsOpen(!isOpen);
      }
      onOpenChange?.(!open);
    };

    const handleClose = () => {
      if (!isControlled) {
        setIsOpen(false);
      }
      onOpenChange?.(false);
    };

    const handleItemClick = (onClick?: () => void) => {
      if (closeOnClick) {
        handleClose();
      }
      onClick?.();
    };

    const handleBlur = (e: React.FocusEvent) => {
      if (closeOnBlur && !menuRef.current?.contains(e.relatedTarget as Node)) {
        handleClose();
      }
    };

    return (
      <div
        ref={menuRef}
        className={cn('relative inline-block', className)}
        onBlur={handleBlur}
        {...props}
      >
        {/* Trigger */}
        <div
          ref={triggerRef}
          onClick={handleToggle}
          className="cursor-pointer"
        >
          {trigger}
        </div>

        {/* Menu Content */}
        {open && (
          <div
            ref={contentRef}
            className={cn(
              'absolute z-50 min-w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg',
              'border border-gray-200 dark:border-gray-700',
              'py-1'
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {showArrow && (
              <div
                className={cn(
                  'absolute w-2 h-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                  'transform rotate-45',
                  placement === 'bottom' && '-top-1 left-4',
                  placement === 'top' && '-bottom-1 left-4',
                  placement === 'left' && '-right-1 top-4',
                  placement === 'right' && '-left-1 top-4'
                )}
              />
            )}
            {children}
          </div>
        )}
      </div>
    );
  }
);

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
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

const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('py-1', className)}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, children, disabled = false, onClick, icon, description, shortcut, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
      danger: 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
      warning: 'text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-4 py-2 text-sm cursor-pointer transition-colors',
          'focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none',
          variantClasses[variant],
          disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
          className
        )}
        onClick={() => !disabled && onClick?.()}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {icon && (
          <span className="mr-3 h-4 w-4">{icon}</span>
        )}
        <div className="flex-1">
          <div>{children}</div>
          {description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </div>
          )}
        </div>
        {shortcut && (
          <span className="ml-4 text-xs text-gray-400 dark:text-gray-500">
            {shortcut}
          </span>
        )}
      </div>
    );
  }
);

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('h-px bg-gray-200 dark:bg-gray-700 my-1', className)}
        {...props}
      />
    );
  }
);

const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400',
          'uppercase tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ className, children, title, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('py-1', className)}
        {...props}
      >
        {title && (
          <MenuLabel>{title}</MenuLabel>
        )}
        {children}
      </div>
    );
  }
);

Menu.displayName = 'Menu';
MenuTrigger.displayName = 'MenuTrigger';
MenuContent.displayName = 'MenuContent';
MenuItem.displayName = 'MenuItem';
MenuSeparator.displayName = 'MenuSeparator';
MenuLabel.displayName = 'MenuLabel';
MenuGroup.displayName = 'MenuGroup';

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup
};

export default Menu;
