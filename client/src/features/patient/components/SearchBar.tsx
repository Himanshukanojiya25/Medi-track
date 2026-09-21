// client/src/features/patient/components/SearchBar.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

export interface SearchBarProps {
  /** Current search value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when search value changes */
  onChange?: (value: string) => void;
  /** Callback when search is submitted (Enter key or search button click) */
  onSearch?: (value: string) => void;
  /** Debounce delay in milliseconds (for onChange) */
  debounceDelay?: number;
  /** Whether to show search button */
  showSearchButton?: boolean;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Input size */
  size?: 'default' | 'sm' | 'lg';
  /** Variant */
  variant?: 'default' | 'rounded' | 'minimal';
}

// ============================================================================
// UTILITIES
// ============================================================================

const debounce = <T extends (...args: string[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SearchBar: React.FC<SearchBarProps> = ({
  value: externalValue = '',
  placeholder = 'Search...',
  onChange,
  onSearch,
  debounceDelay = 300,
  showSearchButton = true,
  showClearButton = true,
  isLoading = false,
  disabled = false,
  autoFocus = false,
  className = '',
  size = 'default',
  variant = 'default',
}) => {
  const [internalValue, setInternalValue] = useState(externalValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = externalValue !== undefined && onChange !== undefined;

  const currentValue = isControlled ? externalValue : internalValue;

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange?.(value);
    }, debounceDelay),
    [onChange, debounceDelay]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    debouncedOnChange(newValue);
  }, [isControlled, debouncedOnChange]);

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
    
    // Focus back on input
    inputRef.current?.focus();
  }, [isControlled, onChange, onSearch]);

  const handleSubmit = useCallback(() => {
    onSearch?.(currentValue);
  }, [onSearch, currentValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // ============================================================================
  // VARIANT STYLES
  // ============================================================================
  const variantStyles = {
    default: 'rounded-md',
    rounded: 'rounded-full',
    minimal: 'rounded-md border-transparent bg-gray-100 focus:bg-white dark:bg-gray-800',
  };

  const sizeStyles = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  };

  return (
    <div className={cn('relative flex w-full items-center gap-2', className)}>
      {/* Search Icon (left) */}
      <div className="pointer-events-none absolute left-3 flex items-center">
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full pl-9 pr-9',
          variantStyles[variant],
          sizeStyles[size],
          showClearButton && currentValue && 'pr-16',
          !showClearButton && showSearchButton && 'pr-16',
        )}
      />

      {/* Clear Button */}
      {showClearButton && currentValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-12 h-7 w-7"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      )}

      {/* Search Button */}
      {showSearchButton && (
        <Button
          onClick={handleSubmit}
          disabled={disabled || isLoading}
          size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
          className="flex-shrink-0"
        >
          Search
        </Button>
      )}
    </div>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default SearchBar;