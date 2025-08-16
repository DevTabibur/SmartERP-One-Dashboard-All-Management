import React, { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollbarSize?: 'sm' | 'md' | 'lg';
  scrollbarVariant?: 'default' | 'minimal' | 'thick';
  autoHide?: boolean;
  autoHideDelay?: number;
  thumbColor?: string;
  trackColor?: string;
  showOnHover?: boolean;
  smooth?: boolean;
  maxHeight?: string | number;
  maxWidth?: string | number;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ 
    className, 
    children,
    orientation = 'vertical',
    scrollbarSize = 'md',
    scrollbarVariant = 'default',
    autoHide = true,
    autoHideDelay = 1000,
    thumbColor,
    trackColor,
    showOnHover = false,
    smooth = true,
    maxHeight,
    maxWidth,
    ...props 
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollbar, setShowScrollbar] = useState(!autoHide);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(0);
    const hideTimeoutRef = useRef<NodeJS.Timeout>();

    const sizeClasses = {
      sm: 'scrollbar-thin',
      md: 'scrollbar',
      lg: 'scrollbar-thick'
    };

    const variantClasses = {
      default: 'scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-400',
      minimal: 'scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500',
      thick: 'scrollbar-track-gray-100 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500'
    };

    const orientationClasses = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto'
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateScrollInfo = () => {
        setScrollTop(container.scrollTop);
        setScrollLeft(container.scrollLeft);
        setContainerHeight(container.clientHeight);
        setContainerWidth(container.clientWidth);
        setScrollHeight(container.scrollHeight);
        setScrollWidth(container.scrollWidth);
      };

      const handleScroll = () => {
        updateScrollInfo();
        
        if (autoHide) {
          setShowScrollbar(true);
          
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
          
          hideTimeoutRef.current = setTimeout(() => {
            setShowScrollbar(false);
          }, autoHideDelay);
        }
      };

      const handleMouseEnter = () => {
        if (showOnHover) {
          setShowScrollbar(true);
        }
      };

      const handleMouseLeave = () => {
        if (showOnHover && autoHide) {
          setShowScrollbar(false);
        }
      };

      updateScrollInfo();
      
      container.addEventListener('scroll', handleScroll);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [autoHide, autoHideDelay, showOnHover]);

    const scrollToTop = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: scrollHeight - containerHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    const scrollToLeft = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    const scrollToRight = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: scrollWidth - containerWidth,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    const canScrollUp = scrollTop > 0;
    const canScrollDown = scrollTop < scrollHeight - containerHeight;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - containerWidth;

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {/* Main Content */}
        <div
          ref={containerRef}
          className={cn(
            'relative',
            orientationClasses[orientation],
            sizeClasses[scrollbarSize],
            variantClasses[scrollbarVariant],
            smooth && 'scroll-smooth'
          )}
          style={{
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            ...(thumbColor && { '--scrollbar-thumb': thumbColor }),
            ...(trackColor && { '--scrollbar-track': trackColor })
          } as React.CSSProperties}
        >
          {children}
        </div>

        {/* Custom Scrollbar Controls */}
        {orientation === 'vertical' && showScrollbar && (
          <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2">
            {canScrollUp && (
              <button
                onClick={scrollToTop}
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors"
                aria-label="Scroll to top"
              >
                ↑
              </button>
            )}
            {canScrollDown && (
              <button
                onClick={scrollToBottom}
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors"
                aria-label="Scroll to bottom"
              >
                ↓
              </button>
            )}
          </div>
        )}

        {orientation === 'horizontal' && showScrollbar && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
            {canScrollLeft && (
              <button
                onClick={scrollToLeft}
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors"
                aria-label="Scroll to left"
              >
                ←
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={scrollToRight}
                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors"
                aria-label="Scroll to right"
              >
                →
              </button>
            )}
          </div>
        )}

        {/* Scroll Position Indicator */}
        {showScrollbar && orientation === 'vertical' && (
          <div className="absolute right-1 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-200"
              style={{
                height: `${(containerHeight / scrollHeight) * 100}%`,
                transform: `translateY(${(scrollTop / (scrollHeight - containerHeight)) * (containerHeight - (containerHeight / scrollHeight) * containerHeight)}px)`
              }}
            />
          </div>
        )}

        {showScrollbar && orientation === 'horizontal' && (
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-200"
              style={{
                width: `${(containerWidth / scrollWidth) * 100}%`,
                transform: `translateX(${(scrollLeft / (scrollWidth - containerWidth)) * (containerWidth - (containerWidth / scrollWidth) * containerWidth)}px)`
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;
