import React, { forwardRef, useState, useRef, useEffect, HTMLAttributes } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    className,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    multiple = false,
    searchable = false,
    clearable = false,
    size = 'md',
    variant = 'default',
    error,
    label,
    helperText,
    fullWidth = false,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const variantClasses = {
      default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      outlined: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
      filled: 'border border-transparent bg-gray-100 dark:bg-gray-700',
    };

    const errorClasses = error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : '';

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (value) {
        if (multiple && Array.isArray(value)) {
          const selected = options.filter(option => value.includes(option.value));
          setSelectedOptions(selected);
        } else if (!multiple && typeof value === 'string') {
          const selected = options.find(option => option.value === value);
          setSelectedOptions(selected ? [selected] : []);
        }
      } else {
        setSelectedOptions([]);
      }
    }, [value, options, multiple]);

    const filteredOptions = options.filter(option =>
      searchable && searchTerm
        ? option.label.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const isSelected = selectedOptions.some(selected => selected.value === option.value);
        let newSelectedOptions: SelectOption[];

        if (isSelected) {
          newSelectedOptions = selectedOptions.filter(selected => selected.value !== option.value);
        } else {
          newSelectedOptions = [...selectedOptions, option];
        }

        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions.map(opt => opt.value));
      } else {
        setSelectedOptions([option]);
        onChange?.(option.value);
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleClear = () => {
      setSelectedOptions([]);
      onChange?.(multiple ? [] : '');
    };

    const getDisplayValue = () => {
      if (selectedOptions.length === 0) return placeholder;
      
      if (multiple) {
        if (selectedOptions.length === 1) return selectedOptions[0].label;
        return `${selectedOptions.length} items selected`;
      }
      
      return selectedOptions[0].label;
    };

    const removeOption = (optionValue: string) => {
      const newSelectedOptions = selectedOptions.filter(option => option.value !== optionValue);
      setSelectedOptions(newSelectedOptions);
      onChange?.(newSelectedOptions.map(opt => opt.value));
    };

    return (
      <div className={cn('relative', fullWidth && 'w-full', className)} ref={containerRef} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md',
              sizeClasses[size],
              variantClasses[variant],
              errorClasses,
              'flex items-center justify-between'
            )}
          >
            <div className="flex items-center flex-wrap gap-1 min-w-0 flex-1">
              {multiple && selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md"
                  >
                    {option.icon && <span className="w-3 h-3">{option.icon}</span>}
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className={cn(
                  selectedOptions.length === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                )}>
                  {getDisplayValue()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              {clearable && selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
              
              <ChevronDownIcon 
                className={cn(
                  'w-4 h-4 text-gray-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} 
              />
            </div>
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedOptions.some(selected => selected.value === option.value);
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20',
                        option.disabled && 'opacity-50 cursor-not-allowed',
                        isSelected && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                        !isSelected && 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                        <span>{option.label}</span>
                        {multiple && isSelected && (
                          <div className="ml-auto w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-sm flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
