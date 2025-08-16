import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  icon?: ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  layout?: 'vertical' | 'horizontal';
  alignment?: 'left' | 'center' | 'right';
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  showConnectors?: boolean;
  showDates?: boolean;
  showTimes?: boolean;
  reverse?: boolean;
}

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  item: TimelineItem;
  index: number;
  isLast: boolean;
  showConnector: boolean;
  layout: 'vertical' | 'horizontal';
  alignment: 'left' | 'center' | 'right';
  showDates: boolean;
  showTimes: boolean;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      items,
      layout = 'vertical',
      alignment = 'left',
      variant = 'default',
      size = 'md',
      showConnectors = true,
      showDates = true,
      showTimes = true,
      reverse = false,
      ...props
    },
    ref
  ) => {
    const sortedItems = reverse ? [...items].reverse() : items;

    const layoutClasses = {
      vertical: 'flex flex-col space-y-4',
      horizontal: 'flex flex-row space-x-4 overflow-x-auto pb-4',
    };

    const alignmentClasses = {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          layoutClasses[layout],
          alignmentClasses[alignment],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {sortedItems.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            index={index}
            isLast={index === sortedItems.length - 1}
            showConnector={showConnectors}
            layout={layout}
            alignment={alignment}
            showDates={showDates}
            showTimes={showTimes}
          />
        ))}
      </div>
    );
  }
);

const TimelineItemComponent = forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      className,
      item,
      index,
      isLast,
      showConnector,
      layout,
      alignment,
      showDates,
      showTimes,
      ...props
    },
    ref
  ) => {
    const getStatusClasses = () => {
      const baseClasses = 'flex items-center justify-center rounded-full border-2';

      const statusClasses = {
        default: 'bg-blue-500 border-blue-500 text-white',
        success: 'bg-green-500 border-green-500 text-white',
        warning: 'bg-yellow-500 border-yellow-500 text-white',
        error: 'bg-red-500 border-red-500 text-white',
        info: 'bg-blue-500 border-blue-500 text-white',
      };

      const variantClasses = {
        default: statusClasses[item.status || 'default'],
        outlined:
          'bg-transparent border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400',
        filled:
          'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400',
      };

      const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
      };

      return cn(
        baseClasses,
        variantClasses[item.variant || 'default'],
        sizeClasses[item.size || 'md']
      );
    };

    const getConnectorClasses = () => {
      if (!showConnector || isLast) return '';

      const baseClasses = 'bg-gray-300 dark:bg-gray-600';

      if (layout === 'vertical') {
        return cn(
          baseClasses,
          'absolute left-1/2 transform -translate-x-1/2 w-0.5',
          item.size === 'sm'
            ? 'top-6 h-4'
            : item.size === 'md'
            ? 'top-8 h-4'
            : 'top-10 h-4'
        );
      }

      return cn(
        baseClasses,
        'absolute top-1/2 transform -translate-y-1/2 h-0.5',
        item.size === 'sm'
          ? 'left-6 w-4'
          : item.size === 'md'
          ? 'left-8 w-4'
          : 'left-10 w-4'
      );
    };

    const getContentAlignment = () => {
      if (layout === 'vertical') {
        return alignment === 'center'
          ? 'text-center'
          : alignment === 'right'
          ? 'text-right'
          : 'text-left';
      }
      return 'text-center';
    };

    return (
      <li
        ref={ref}
        className={cn(
          'relative flex',
          layout === 'vertical' ? 'flex-col' : 'flex-col min-w-0',
          className
        )}
        {...props}
      >
        {/* Icon/Status Circle */}
        <div
          className={cn(
            'relative z-10',
            layout === 'vertical' ? 'self-center' : 'self-center'
          )}
        >
          <div className={getStatusClasses()}>
            {item.icon || (
              <span className="text-xs font-medium">{index + 1}</span>
            )}
          </div>
        </div>

        {/* Connector Line */}
        {showConnector && !isLast && <div className={getConnectorClasses()} />}

        {/* Content */}
        <div
          className={cn(
            'mt-3',
            layout === 'vertical' ? 'w-full' : 'min-w-0',
            getContentAlignment()
          )}
        >
          {/* Title */}
          <h3
            className={cn(
              'font-medium text-gray-900 dark:text-gray-100',
              item.size === 'sm'
                ? 'text-sm'
                : item.size === 'md'
                ? 'text-base'
                : 'text-lg'
            )}
          >
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p
              className={cn(
                'mt-1 text-gray-600 dark:text-gray-400',
                item.size === 'sm'
                  ? 'text-xs'
                  : item.size === 'md'
                  ? 'text-sm'
                  : 'text-base'
              )}
            >
              {item.description}
            </p>
          )}

          {/* Date and Time */}
          {(showDates || showTimes) && (item.date || item.time) && (
            <div
              className={cn(
                'mt-2 flex items-center gap-2',
                item.size === 'sm' ? 'text-xs' : 'text-sm',
                'text-gray-500 dark:text-gray-400'
              )}
            >
              {showDates && item.date && <span>{item.date}</span>}
              {showDates && showTimes && item.date && item.time && (
                <span>•</span>
              )}
              {showTimes && item.time && <span>{item.time}</span>}
            </div>
          )}
        </div>
      </li>
    );
  }
);

Timeline.displayName = 'Timeline';
TimelineItemComponent.displayName = 'TimelineItemComponent';

export default Timeline;
