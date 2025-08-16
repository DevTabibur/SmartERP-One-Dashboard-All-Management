import React, { forwardRef, useState, HTMLAttributes, createContext, useContext } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  allowMultiple?: boolean;
  defaultOpen?: string[];
  children: React.ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, allowMultiple = false, defaultOpen = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
      if (allowMultiple) {
        setOpenItems(prev => 
          prev.includes(id) 
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
      } else {
        setOpenItems(prev => 
          prev.includes(id) ? [] : [id]
        );
      }
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
        <div
          ref={ref}
          className={cn('w-full space-y-2', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, id, children, disabled = false, ...props }, ref) => {
    const { openItems } = useAccordion();
    const isOpen = openItems.includes(id);

    return (
      <div
        ref={ref}
        className={cn(
          'border border-gray-200 rounded-lg overflow-hidden',
          'dark:border-gray-700',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { toggleItem, openItems } = useAccordion();
    const itemId = (props as any).id || 'accordion-trigger';
    const isOpen = openItems.includes(itemId);

    if (asChild) {
      return (
        <div
          className={cn(
            'flex w-full items-center justify-between px-4 py-3 text-left',
            'font-medium text-gray-900 dark:text-gray-100',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'dark:focus:ring-offset-gray-900',
            'transition-colors duration-200',
            className
          )}
          onClick={() => toggleItem(itemId)}
          aria-expanded={isOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleItem(itemId);
            }
          }}
        >
          <span className="flex-1">{children}</span>
          <ChevronDownIcon
            className={cn(
              'h-5 w-5 text-gray-500 transition-transform duration-200',
              'dark:text-gray-400',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 text-left',
          'font-medium text-gray-900 dark:text-gray-100',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          'transition-colors duration-200',
          className
        )}
        onClick={() => toggleItem(itemId)}
        aria-expanded={isOpen}
        {...props}
      >
        <span className="flex-1">{children}</span>
        <ChevronDownIcon
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform duration-200',
            'dark:text-gray-400',
            isOpen && 'rotate-180'
          )}
        />
      </button>
    );
  }
);

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = useAccordion();
    const itemId = (props as any).id || 'accordion-content';
    const isOpen = openItems.includes(itemId);

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        {...props}
      >
        <div className={cn('px-4 pb-3 pt-0', className)}>
          {children}
        </div>
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;
