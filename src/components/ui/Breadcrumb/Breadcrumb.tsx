import React, { forwardRef, HTMLAttributes } from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  isCurrentPage?: boolean;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, children, separator = <ChevronRightIcon className="h-4 w-4 text-gray-400" />, showHome = true, homeIcon = <HomeIcon className="h-4 w-4" />, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}
        {...props}
      >
        {showHome && (
          <>
            <BreadcrumbItem href="/" className="flex items-center">
              {homeIcon}
            </BreadcrumbItem>
            {separator}
          </>
        )}
        {children}
      </nav>
    );
  }
);

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children, href, isCurrentPage = false, onClick, ...props }, ref) => {
    if (href) {
      return (
        <li
          ref={ref}
          className={cn('inline-flex items-center', className)}
          {...props}
        >
          <BreadcrumbLink href={href} isCurrentPage={isCurrentPage}>
            {children}
          </BreadcrumbLink>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        className={cn('inline-flex items-center', className)}
        {...props}
      >
        {onClick ? (
          <button
            onClick={onClick}
            className={cn(
              'hover:text-gray-700 dark:hover:text-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'dark:focus:ring-offset-gray-900 rounded'
            )}
          >
            {children}
          </button>
        ) : (
          <span className={cn(
            isCurrentPage && 'text-gray-900 dark:text-gray-100 font-medium'
          )}>
            {children}
          </span>
        )}
      </li>
    );
  }
);

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, children, href, isCurrentPage = false, ...props }, ref) => {
    if (isCurrentPage) {
      return (
        <span
          ref={ref}
          aria-current="page"
          className={cn(
            'text-gray-900 dark:text-gray-100 font-medium',
            className
          )}
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'hover:text-gray-700 dark:hover:text-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900 rounded transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink };
export default Breadcrumb;
