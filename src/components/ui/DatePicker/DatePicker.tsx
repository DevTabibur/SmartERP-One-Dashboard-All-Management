import React, { forwardRef, useState, useRef, useEffect, InputHTMLAttributes } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM-DD-YYYY';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: (date: Date | null) => void;
  onDateChange?: (date: Date | null) => void;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    placeholder = 'Select date',
    format = 'MM/DD/YYYY',
    locale = 'en-US',
    minDate,
    maxDate,
    disabled = false,
    fullWidth = false,
    onChange,
    onDateChange,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [inputValue, setInputValue] = useState('');
    const calendarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize with value or defaultValue
    useEffect(() => {
      if (value instanceof Date) {
        setSelectedDate(value);
        setInputValue(formatDate(value, format));
      } else if (defaultValue instanceof Date) {
        setSelectedDate(defaultValue);
        setInputValue(formatDate(defaultValue, format));
      }
    }, [value, defaultValue, format]);

    // Close calendar when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const formatDate = (date: Date, format: string): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      switch (format) {
        case 'MM/DD/YYYY':
          return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
          return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
          return `${year}-${month}-${day}`;
        case 'MM-DD-YYYY':
          return `${month}-${day}-${year}`;
        default:
          return `${month}/${day}/${year}`;
      }
    };

    const parseDate = (input: string): Date | null => {
      if (!input) return null;

      let day: number, month: number, year: number;

      switch (format) {
        case 'MM/DD/YYYY':
          const mmdd = input.split('/');
          if (mmdd.length !== 3) return null;
          month = parseInt(mmdd[0]) - 1;
          day = parseInt(mmdd[1]);
          year = parseInt(mmdd[2]);
          break;
        case 'DD/MM/YYYY':
          const ddmm = input.split('/');
          if (ddmm.length !== 3) return null;
          day = parseInt(ddmm[0]);
          month = parseInt(ddmm[1]) - 1;
          year = parseInt(ddmm[2]);
          break;
        case 'YYYY-MM-DD':
          const yyyy = input.split('-');
          if (yyyy.length !== 3) return null;
          year = parseInt(yyyy[0]);
          month = parseInt(yyyy[1]) - 1;
          day = parseInt(yyyy[2]);
          break;
        case 'MM-DD-YYYY':
          const mmdd2 = input.split('-');
          if (mmdd2.length !== 3) return null;
          month = parseInt(mmdd2[0]) - 1;
          day = parseInt(mmdd2[1]);
          year = parseInt(mmdd2[2]);
          break;
        default:
          return null;
      }

      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) return null;
      return date;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      const parsedDate = parseDate(value);
      if (parsedDate) {
        setSelectedDate(parsedDate);
        onChange?.(parsedDate);
        onDateChange?.(parsedDate);
      }
    };

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setInputValue(formatDate(date, format));
      setCurrentMonth(date);
      setIsOpen(false);
      onChange?.(date);
      onDateChange?.(date);
    };

    const handleInputClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleInputClick();
      }
    };

    const goToPreviousMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const days: (Date | null)[] = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDay; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }

      return days;
    };

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const isDateSelected = (date: Date): boolean => {
      return selectedDate ? 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear() : false;
    };

    const isToday = (date: Date): boolean => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    };

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

    return (
      <div className={cn('relative', fullWidth && 'w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 border rounded-md shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100',
              'dark:focus:ring-blue-400 dark:focus:border-blue-400',
              error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
              className
            )}
            {...props}
          />
          
          <button
            type="button"
            onClick={handleInputClick}
            disabled={disabled}
            className={cn(
              'absolute inset-y-0 right-0 pr-3 flex items-center',
              'text-gray-400 hover:text-gray-600',
              'dark:text-gray-500 dark:hover:text-gray-300'
            )}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>

        {isOpen && (
          <div
            ref={calendarRef}
            className={cn(
              'absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
              'dark:bg-gray-800 dark:border-gray-700',
              'w-80 p-4'
            )}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className={cn(
                  'p-1 rounded-md hover:bg-gray-100',
                  'dark:hover:bg-gray-700'
                )}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {monthName}
              </h3>
              
              <button
                type="button"
                onClick={goToNextMonth}
                className={cn(
                  'p-1 rounded-md hover:bg-gray-100',
                  'dark:hover:bg-gray-700'
                )}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
              
              {days.map((date, index) => (
                <div key={index} className="text-center">
                  {date ? (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      disabled={isDateDisabled(date)}
                      className={cn(
                        'w-8 h-8 rounded-md text-sm font-medium transition-colors',
                        'hover:bg-blue-100 dark:hover:bg-blue-900',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        'dark:focus:ring-offset-gray-800',
                        isDateSelected(date) && 'bg-blue-600 text-white hover:bg-blue-700',
                        isToday(date) && !isDateSelected(date) && 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
                        isDateDisabled(date) && 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
                        !isDateDisabled(date) && !isDateSelected(date) && 'text-gray-900 dark:text-gray-100'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              ))}
            </div>

            {/* Today Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700',
                  'dark:text-blue-400 dark:hover:text-blue-300'
                )}
              >
                Today
              </button>
            </div>
          </div>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
