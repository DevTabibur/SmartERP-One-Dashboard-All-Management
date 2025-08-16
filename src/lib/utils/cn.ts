import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to conditionally apply classes
 */
export function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to create responsive classes
 */
export function responsive(prefix: string, breakpoints: Record<string, string>) {
  return Object.entries(breakpoints)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'default') return `${prefix}-${value}`;
      return `${breakpoint}:${prefix}-${value}`;
    })
    .join(' ');
}
