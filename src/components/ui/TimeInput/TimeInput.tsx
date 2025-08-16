import React, { forwardRef, useState, useRef, useEffect, InputHTMLAttributes } from 'react';
import { ClockIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface TimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  format?: '12h' | '24h';
  showSeconds?: boolean;
  showAmPm?: boolean;
  minTime?: string;
  maxTime?: string;
  step?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: (time: string) => void;
  onTimeChange?: (time: { hours: number; minutes: number; seconds?: number; ampm?: 'AM' | 'PM' }) => void;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({
    className,
    label,
    error,
    helperText,
    placeholder = 'Select time',
    format = '24h',
    showSeconds = false,
    showAmPm = false,
    minTime,
    maxTime,
    step = 900, // 15 minutes in seconds
    disabled = false,
    fullWidth = false,
    onChange,
    onTimeChange,
    value,
    defaultValue,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<{ hours: number; minutes: number; seconds?: number; ampm?: 'AM' | 'PM' }>({ hours: 0, minutes: 0 });
    const [inputValue, setInputValue] = useState('');
    const timePickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize with value or defaultValue
    useEffect(() => {
      if (value) {
        const parsedTime = parseTimeString(value as string);
        if (parsedTime) {
          setSelectedTime(parsedTime);
          setInputValue(formatTimeString(parsedTime));
        }
      } else if (defaultValue) {
        const parsedTime = parseTimeString(defaultValue as string);
        if (parsedTime) {
          setSelectedTime(parsedTime);
          setInputValue(formatTimeString(parsedTime));
        }
      }
    }, [value, defaultValue]);

    // Close time picker when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const parseTimeString = (timeString: string) => {
      const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i;
      const match = timeString.match(timeRegex);
      
      if (!match) return null;

      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = match[3] ? parseInt(match[3]) : 0;
      const ampm = match[4]?.toUpperCase() as 'AM' | 'PM';

      if (format === '12h' && ampm) {
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
      }

      return { hours, minutes, seconds, ampm };
    };

    const formatTimeString = (time: { hours: number; minutes: number; seconds?: number; ampm?: 'AM' | 'PM' }) => {
      let { hours, minutes, seconds, ampm } = time;
      
      if (format === '12h') {
        if (hours === 0) hours = 12;
        if (hours > 12) {
          hours -= 12;
          ampm = 'PM';
        } else if (hours === 12) {
          ampm = 'PM';
        } else {
          ampm = 'AM';
        }
      }

      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      if (showSeconds && seconds !== undefined) {
        return `${timeStr}:${seconds.toString().padStart(2, '0')}${showAmPm && ampm ? ` ${ampm}` : ''}`;
      }
      
      return `${timeStr}${showAmPm && ampm ? ` ${ampm}` : ''}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      const parsedTime = parseTimeString(value);
      if (parsedTime) {
        setSelectedTime(parsedTime);
        onChange?.(value);
        onTimeChange?.(parsedTime);
      }
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

    const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: number) => {
      const newTime = { ...selectedTime };
      
      if (type === 'hours') {
        newTime.hours = format === '24h' ? Math.max(0, Math.min(23, value)) : Math.max(1, Math.min(12, value));
      } else if (type === 'minutes') {
        newTime.minutes = Math.max(0, Math.min(59, value));
      } else if (type === 'seconds') {
        newTime.seconds = Math.max(0, Math.min(59, value));
      }

      setSelectedTime(newTime);
      const formattedTime = formatTimeString(newTime);
      setInputValue(formattedTime);
      onChange?.(formattedTime);
      onTimeChange?.(newTime);
    };

    const handleAmPmChange = (ampm: 'AM' | 'PM') => {
      const newTime = { ...selectedTime, ampm };
      setSelectedTime(newTime);
      const formattedTime = formatTimeString(newTime);
      setInputValue(formattedTime);
      onChange?.(formattedTime);
      onTimeChange?.(newTime);
    };

    const generateTimeOptions = (type: 'hours' | 'minutes' | 'seconds') => {
      const max = type === 'hours' ? (format === '24h' ? 24 : 12) : 60;
      const stepValue = type === 'minutes' ? step / 60 : type === 'seconds' ? step : 1;
      
      const options = [];
      for (let i = 0; i < max; i += stepValue) {
        if (type === 'hours' && format === '12h' && i === 0) continue;
        options.push(i);
      }
      
      return options;
    };

    const isTimeValid = (time: { hours: number; minutes: number; seconds?: number }) => {
      if (minTime) {
        const min = parseTimeString(minTime);
        if (min && (time.hours < min.hours || (time.hours === min.hours && time.minutes < min.minutes))) {
          return false;
        }
      }
      
      if (maxTime) {
        const max = parseTimeString(maxTime);
        if (max && (time.hours > max.hours || (time.hours === max.hours && time.minutes > max.minutes))) {
          return false;
        }
      }
      
      return true;
    };

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
            <ClockIcon className="h-5 w-5" />
          </button>
        </div>

        {isOpen && (
          <div
            ref={timePickerRef}
            className={cn(
              'absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
              'dark:bg-gray-800 dark:border-gray-700',
              'w-64 p-4'
            )}
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Hours */}
              <div className="text-center">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Hours
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('hours', selectedTime.hours + 1)}
                    className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronUpIcon className="h-4 w-4 mx-auto" />
                  </button>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTime.hours.toString().padStart(2, '0')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('hours', selectedTime.hours - 1)}
                    className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronDownIcon className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Minutes */}
              <div className="text-center">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Minutes
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('minutes', selectedTime.minutes + 1)}
                    className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronUpIcon className="h-4 w-4 mx-auto" />
                  </button>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTime.minutes.toString().padStart(2, '0')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('minutes', selectedTime.minutes - 1)}
                    className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ChevronDownIcon className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Seconds */}
              {showSeconds && (
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Seconds
                  </label>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleTimeChange('seconds', (selectedTime.seconds || 0) + 1)}
                      className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <ChevronUpIcon className="h-4 w-4 mx-auto" />
                    </button>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {(selectedTime.seconds || 0).toString().padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTimeChange('seconds', (selectedTime.seconds || 0) - 1)}
                      className="w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <ChevronDownIcon className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AM/PM Toggle */}
            {showAmPm && format === '12h' && (
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleAmPmChange('AM')}
                  className={cn(
                    'px-3 py-1 rounded text-sm font-medium transition-colors',
                    selectedTime.ampm === 'AM'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleAmPmChange('PM')}
                  className={cn(
                    'px-3 py-1 rounded text-sm font-medium transition-colors',
                    selectedTime.ampm === 'PM'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  PM
                </button>
              </div>
            )}

            {/* Quick Time Options */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const newTime = {
                    hours: now.getHours(),
                    minutes: now.getMinutes(),
                    seconds: now.getSeconds(),
                    ampm: format === '12h' ? (now.getHours() >= 12 ? 'PM' : 'AM') : undefined
                  };
                  setSelectedTime(newTime as any);
                  const formattedTime = formatTimeString(newTime as any);
                  setInputValue(formattedTime);
                  onChange?.(formattedTime);
                  onTimeChange?.(newTime as any);
                }}
                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded"
              >
                Done
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

TimeInput.displayName = 'TimeInput';

export default TimeInput;
