import React, { forwardRef, HTMLAttributes, useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showItemsInfo?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  siblingCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'minimal';
  disabled?: boolean;
}

export interface PaginationItemProps extends HTMLAttributes<HTMLButtonElement> {
  page: number;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    className, 
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
    showPageNumbers = true,
    showFirstLast = true,
    showPrevNext = true,
    showItemsInfo = false,
    showPageSizeSelector = false,
    pageSizeOptions = [10, 20, 50, 100],
    onPageSizeChange,
    siblingCount = 1,
    size = 'md',
    variant = 'default',
    disabled = false,
    ...props 
  }, ref) => {
    const [selectedPageSize, setSelectedPageSize] = useState(itemsPerPage);

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const buttonSizeClasses = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg'
    };

    const variantClasses = {
      default: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      outlined: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      minimal: 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
    };

    const activeClasses = {
      default: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outlined: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      minimal: 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 focus:ring-blue-500'
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    const pageNumbers = useMemo(() => {
      const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
      const startPage = Math.max(1, currentPage - siblingCount);
      const endPage = Math.min(totalPages, currentPage + siblingCount);

      if (totalNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const leftSiblingIndex = Math.max(startPage, 1);
      const rightSiblingIndex = Math.min(endPage, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        return [
          ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
          'ellipsis',
          totalPages
        ];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        return [
          1,
          'ellipsis',
          ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)
        ];
      }

      return [
        1,
        'ellipsis',
        ...Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i),
        'ellipsis',
        totalPages
      ];
    }, [currentPage, totalPages, siblingCount]);

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && !disabled) {
        onPageChange(page);
      }
    };

    const handlePageSizeChange = (newPageSize: number) => {
      setSelectedPageSize(newPageSize);
      onPageSizeChange?.(newPageSize);
    };

    const startItem = (currentPage - 1) * selectedPageSize + 1;
    const endItem = Math.min(currentPage * selectedPageSize, totalItems || 0);

    if (totalPages <= 1) return null;

    return (
      <div
        ref={ref}
        className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
        {...props}
      >
        {/* Items Info */}
        {showItemsInfo && totalItems && (
          <div className={cn('text-gray-700 dark:text-gray-300', sizeClasses[size])}>
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        )}

        {/* Page Size Selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className={cn('text-gray-700 dark:text-gray-300', sizeClasses[size])}>
              Show:
            </span>
            <select
              value={selectedPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className={cn(
                'border border-gray-300 rounded-md px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          {showFirstLast && (
            <PaginationItem
              page={1}
              isDisabled={currentPage === 1 || disabled}
              onClick={() => handlePageChange(1)}
              size={size}
              variant={variant}
              className="rounded-l-md"
            >
              First
            </PaginationItem>
          )}

          {/* Previous Page */}
          {showPrevNext && (
            <PaginationItem
              page={currentPage - 1}
              isDisabled={currentPage === 1 || disabled}
              onClick={() => handlePageChange(currentPage - 1)}
              size={size}
              variant={variant}
              className={cn(!showFirstLast && 'rounded-l-md')}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {showPageNumbers && pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationEllipsis
                  key={`ellipsis-${index}`}
                  size={size}
                  variant={variant}
                />
              );
            }

            return (
              <PaginationItem
                key={page}
                page={page as number}
                isActive={page === currentPage}
                isDisabled={disabled}
                onClick={() => handlePageChange(page as number)}
                size={size}
                variant={variant}
              >
                {page}
              </PaginationItem>
            );
          })}

          {/* Next Page */}
          {showPrevNext && (
            <PaginationItem
              page={currentPage + 1}
              isDisabled={currentPage === totalPages || disabled}
              onClick={() => handlePageChange(currentPage + 1)}
              size={size}
              variant={variant}
              className={cn(!showFirstLast && 'rounded-r-md')}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PaginationItem>
          )}

          {/* Last Page */}
          {showFirstLast && (
            <PaginationItem
              page={totalPages}
              isDisabled={currentPage === totalPages || disabled}
              onClick={() => handlePageChange(totalPages)}
              size={size}
              variant={variant}
              className="rounded-r-md"
            >
              Last
            </PaginationItem>
          )}
        </div>
      </div>
    );
  }
);

const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ className, page, isActive = false, isDisabled = false, onClick, children, size = 'md', variant = 'default', ...props }, ref) => {
    const buttonSizeClasses = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg'
    };

    const variantClasses = {
      default: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      outlined: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      minimal: 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
    };

    const activeClasses = {
      default: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outlined: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      minimal: 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 focus:ring-blue-500'
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center border font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          buttonSizeClasses[size],
          isActive ? activeClasses[variant] : variantClasses[variant],
          isDisabled && disabledClasses,
          className
        )}
        {...props}
      >
        {children || page}
      </button>
    );
  }
);

const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const buttonSizeClasses = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg'
    };

    const variantClasses = {
      default: 'bg-white border-gray-300 text-gray-500',
      outlined: 'bg-transparent border-2 border-gray-300 text-gray-500',
      minimal: 'bg-transparent border-gray-300 text-gray-500'
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center border font-medium',
          buttonSizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <EllipsisHorizontalIcon className="h-4 w-4" />
      </span>
    );
  }
);

Pagination.displayName = 'Pagination';
PaginationItem.displayName = 'PaginationItem';
PaginationEllipsis.displayName = 'PaginationEllipsis';

export { Pagination, PaginationItem, PaginationEllipsis };
export default Pagination;
