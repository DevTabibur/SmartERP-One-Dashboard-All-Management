import React, {
  forwardRef,
  HTMLAttributes,
  useState,
  useRef,
  useEffect,
  ReactNode,
  MutableRefObject,
} from 'react';
import { cn } from '@/lib/utils/cn';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  delay?: number;
  showArrow?: boolean;
  variant?:
    | 'default'
    | 'dark'
    | 'light'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  trigger?: 'hover' | 'click' | 'focus';
  maxWidth?: number;
}

type TooltipPosition = { top: number; left: number };

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      content,
      children,
      position: positionProp = 'top',
      align = 'center',
      offset = 8,
      delay = 200,
      showArrow = true,
      variant = 'default',
      size = 'md',
      disabled = false,
      trigger = 'hover',
      maxWidth = 200,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({
      top: 0,
      left: 0,
    });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Merge forwarded ref with triggerRef
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(triggerRef.current);
      } else {
        (ref as MutableRefObject<HTMLDivElement | null>).current =
          triggerRef.current;
      }
    }, [ref]);

    useEffect(() => {
      if (isVisible) {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition, true);
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, positionProp, align, offset, maxWidth, content]);

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      let top = 0;
      let left = 0;

      switch (positionProp) {
        case 'top':
          top = triggerRect.top + scrollTop - tooltipRect.height - offset;
          left = triggerRect.left + scrollLeft;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollTop + offset;
          left = triggerRect.left + scrollLeft;
          break;
        case 'left':
          top = triggerRect.top + scrollTop;
          left = triggerRect.left + scrollLeft - tooltipRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + scrollTop;
          left = triggerRect.right + scrollLeft + offset;
          break;
        default:
          break;
      }

      switch (align) {
        case 'start':
          if (positionProp === 'left' || positionProp === 'right') {
            // top already set
          } else {
            // top/bottom
            // left already set
          }
          break;
        case 'center':
          if (positionProp === 'left' || positionProp === 'right') {
            top =
              triggerRect.top +
              scrollTop +
              triggerRect.height / 2 -
              tooltipRect.height / 2;
          } else {
            left =
              triggerRect.left +
              scrollLeft +
              triggerRect.width / 2 -
              tooltipRect.width / 2;
          }
          break;
        case 'end':
          if (positionProp === 'left' || positionProp === 'right') {
            top = triggerRect.bottom + scrollTop - tooltipRect.height;
          } else {
            left = triggerRect.right + scrollLeft - tooltipRect.width;
          }
          break;
        default:
          break;
      }

      setTooltipPos({ top, left });
    };

    const showTooltip = () => {
      if (disabled) return;
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        showTooltip();
      }
    };

    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        hideTooltip();
      }
    };

    const handleClick = () => {
      if (trigger === 'click') {
        setIsVisible((v) => !v);
      }
    };

    const handleFocus = () => {
      if (trigger === 'focus') {
        showTooltip();
      }
    };

    const handleBlur = () => {
      if (trigger === 'focus') {
        hideTooltip();
      }
    };

    const getVariantClasses = () => {
      const baseClasses = 'px-3 py-2 rounded-lg shadow-lg border text-sm';

      const variantClasses: Record<string, string> = {
        default:
          'bg-gray-900 text-white border-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-300',
        dark: 'bg-gray-900 text-white border-gray-700',
        light:
          'bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
        info: 'bg-blue-600 text-white border-blue-700 dark:bg-blue-500 dark:border-blue-600',
        success:
          'bg-green-600 text-white border-green-700 dark:bg-green-500 dark:border-green-600',
        warning:
          'bg-yellow-600 text-white border-yellow-700 dark:bg-yellow-500 dark:border-yellow-600',
        error:
          'bg-red-600 text-white border-red-700 dark:bg-red-500 dark:border-red-600',
      };

      return cn(baseClasses, variantClasses[variant]);
    };

    const getSizeClasses = () => {
      const sizeClasses: Record<string, string> = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3',
      };

      return sizeClasses[size];
    };

    const getArrowClasses = () => {
      if (!showArrow) return '';

      const baseClasses = 'absolute w-2 h-2 bg-current rotate-45';

      const positionClasses: Record<string, string> = {
        top: 'top-full -mt-1 left-1/2 -translate-x-1/2',
        bottom: 'bottom-full -mb-1 left-1/2 -translate-x-1/2',
        left: 'left-full -ml-1 top-1/2 -translate-y-1/2',
        right: 'right-full -mr-1 top-1/2 -translate-y-1/2',
      };

      return cn(baseClasses, positionClasses[positionProp]);
    };

    const getArrowColor = () => {
      const arrowColors: Record<string, string> = {
        default: 'text-gray-900 dark:text-gray-100',
        dark: 'text-gray-900',
        light: 'text-white dark:text-gray-800',
        info: 'text-blue-600 dark:text-blue-500',
        success: 'text-green-600 dark:text-green-500',
        warning: 'text-yellow-600 dark:text-yellow-500',
        error: 'text-red-600 dark:text-red-500',
      };

      return arrowColors[variant];
    };

    return (
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={trigger === 'focus' ? 0 : undefined}
        style={{ display: 'inline-block' }}
      >
        {children}

        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-50 pointer-events-none',
              'transition-opacity duration-200',
              className
            )}
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              maxWidth: maxWidth,
              position: 'fixed',
            }}
            {...props}
          >
            <div className={cn(getVariantClasses(), getSizeClasses())}>
              {content}
              {showArrow && (
                <div className={cn(getArrowClasses(), getArrowColor())} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
