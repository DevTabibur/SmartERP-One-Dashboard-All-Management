import { cn } from '@/lib/utils/cn';
import React, { forwardRef, useState, HTMLAttributes, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'default' | 'pills' | 'underline' | 'cards';
  size: 'sm' | 'md' | 'lg';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className,
    defaultValue,
    value: controlledValue,
    onValueChange,
    variant = 'default',
    size = 'md',
    orientation = 'horizontal',
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const activeTab = isControlled ? controlledValue : internalValue;

    const setActiveTab = (id: string) => {
      if (!isControlled) {
        setInternalValue(id);
      }
      onValueChange?.(id);
    };

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size }}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            orientation === 'vertical' && 'flex',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// Tabs List Component
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, fullWidth = false, children, ...props }, ref) => {
    const { variant, size, orientation } = useTabsContext();

    const baseClasses = 'flex transition-all duration-200';
    
    const variantClasses = {
      default: 'border-b border-gray-200 dark:border-gray-700',
      pills: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      underline: 'border-b border-gray-200 dark:border-gray-700',
      cards: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    };

    const orientationClasses = {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          orientationClasses[orientation],
          widthClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

// Tabs Trigger Component
export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, icon, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant, size } = useTabsContext();
    const isActive = activeTab === value;

    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantClasses = {
      default: cn(
        'border-b-2 border-transparent px-3 py-2 text-gray-500 hover:text-gray-700 hover:border-gray-300',
        isActive && 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
      ),
      pills: cn(
        'px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
        isActive && 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
      ),
      underline: cn(
        'border-b-2 border-transparent px-3 py-2 text-gray-500 hover:text-gray-700 hover:border-gray-300',
        isActive && 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
      ),
      cards: cn(
        'px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700',
        isActive && 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
      ),
    };

    const sizeClasses = {
      sm: 'text-sm px-2 py-1',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        onClick={() => setActiveTab(value)}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// Tabs Content Component
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab, size } = useTabsContext();
    const isActive = activeTab === value;

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    };

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'mt-2 focus:outline-none',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export default Tabs;
