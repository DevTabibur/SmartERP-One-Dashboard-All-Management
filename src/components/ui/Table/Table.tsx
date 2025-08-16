import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> extends HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  rowKey?: keyof T | ((record: T) => string);
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Table = forwardRef<HTMLDivElement, TableProps>(
  <T extends Record<string, any>>({
    className,
    data,
    columns,
    loading = false,
    pagination = false,
    pageSize = 10,
    currentPage = 1,
    total = 0,
    onPageChange,
    sortable = false,
    onSort,
    rowKey = 'id',
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    striped = false,
    hoverable = true,
    bordered = false,
    size = 'md',
    ...props
  }: TableProps<T>, ref) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    };

    const paddingClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };

    const handleSort = (column: Column<T>) => {
      if (!column.sortable || !onSort) return;

      const direction = sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key: column.key, direction });
      onSort(column.key, direction);
    };

    const getRowKey = (record: T, index: number): string => {
      if (typeof rowKey === 'function') return rowKey(record);
      if (typeof rowKey === 'string') return String(record[rowKey]);
      return String(index);
    };

    const handleSelectAll = (checked: boolean) => {
      if (onSelectionChange) {
        onSelectionChange(checked ? data : []);
      }
    };

    const handleSelectRow = (record: T, checked: boolean) => {
      if (onSelectionChange) {
        const newSelectedRows = checked
          ? [...selectedRows, record]
          : selectedRows.filter(row => getRowKey(row, 0) !== getRowKey(record, 0));
        onSelectionChange(newSelectedRows);
      }
    };

    const isRowSelected = (record: T) => {
      return selectedRows.some(row => getRowKey(row, 0) === getRowKey(record, 0));
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="overflow-x-auto">
          <table className={cn(
            'w-full border-collapse',
            bordered && 'border border-gray-200 dark:border-gray-700'
          )}>
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {selectable && (
                  <th className={cn(
                    'border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white',
                    paddingClasses[size],
                    'w-12'
                  )}>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === data.length && data.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </th>
                )}
                
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white text-left',
                      paddingClasses[size],
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer select-none',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => handleSort(column)}
                  >
                    <div className={cn(
                      'flex items-center',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}>
                      <span>{column.title}</span>
                      {column.sortable && (
                        <span className="ml-1">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-white dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className={cn(
                      'text-center py-8 text-gray-500 dark:text-gray-400',
                      sizeClasses[size]
                    )}
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className={cn(
                      'text-center py-8 text-gray-500 dark:text-gray-400',
                      sizeClasses[size]
                    )}
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <tr
                    key={getRowKey(record, index)}
                    className={cn(
                      'transition-colors duration-150',
                      striped && index % 2 === 1 && 'bg-gray-50 dark:bg-gray-800/50',
                      hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      bordered && 'border-b border-gray-200 dark:border-gray-700'
                    )}
                  >
                    {selectable && (
                      <td className={cn(
                        'border-b border-gray-200 dark:border-gray-700',
                        paddingClasses[size]
                      )}>
                        <input
                          type="checkbox"
                          checked={isRowSelected(record)}
                          onChange={(e) => handleSelectRow(record, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'border-b border-gray-200 dark:border-gray-700',
                          paddingClasses[size],
                          sizeClasses[size],
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render
                          ? column.render(record[column.dataIndex as keyof T] || '', record, index)
                          : record[column.dataIndex as keyof T] || ''}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    'px-3 py-1 text-sm border rounded-md transition-colors duration-150',
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = 'Table';

export default Table;
