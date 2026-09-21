// client/src/components/ui/select/Select.tsx
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  maxHeight?: number;
  portal?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

// ============================================================================
// DROPDOWN PORTAL
// ============================================================================

interface DropdownPortalProps {
  children: React.ReactNode;
  rect: DOMRect | null;
  maxHeight: number;
  dropdownClassName?: string;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({
  children,
  rect,
  maxHeight,
  dropdownClassName,
  dropdownRef,
}) => {
  if (!rect) return null;

  const GAP = 4;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom - GAP;
  const spaceAbove = rect.top - GAP;
  const openUpward =
    spaceBelow < Math.min(maxHeight, 200) && spaceAbove > spaceBelow;

  const style: React.CSSProperties = {
    position: 'fixed',
    left: rect.left,
    width: rect.width,
    maxHeight: openUpward
      ? Math.min(maxHeight, spaceAbove)
      : Math.min(maxHeight, spaceBelow),
    zIndex: 9999,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    overflowY: 'auto',
    ...(openUpward
      ? { bottom: viewportHeight - rect.top + GAP }
      : { top: rect.bottom + GAP }),
  };

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      style={style}
      className={dropdownClassName}
    >
      {children}
    </div>,
    document.body,
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = 'Select an option',
      searchable = false,
      clearable = false,
      error = false,
      errorMessage,
      disabled = false,
      loading = false,
      required = false,
      label,
      description,
      className = '',
      triggerClassName = '',
      dropdownClassName = '',
      optionClassName = '',
      maxHeight = 280,
      portal = true,
      onOpen,
      onClose,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedLabel = selectedOption?.label ?? '';

    const filteredOptions =
      searchable && searchTerm
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : options;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const captureRect = () => {
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
    };

    const handleOpen = () => {
      if (disabled || loading) return;
      captureRect();
      setIsOpen(true);
      onOpen?.();
    };

    const handleClose = () => {
      setIsOpen(false);
      setSearchTerm('');
      onClose?.();
    };

    const handleSelect = (
      selectedValue: string,
      selectedDisabled?: boolean,
    ) => {
      if (selectedDisabled) return;
      onChange?.(selectedValue);
      handleClose();
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
    };

    // ── Effects ───────────────────────────────────────────────────────────────

    useEffect(() => {
      if (!isOpen) return;

      const handleReposition = () => captureRect();

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const insideTrigger = containerRef.current?.contains(target) ?? false;
        const insideDropdown = dropdownRef.current?.contains(target) ?? false;
        if (!insideTrigger && !insideDropdown) handleClose();
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleReposition, true);
      window.addEventListener('resize', handleReposition);

      let timer: ReturnType<typeof setTimeout> | null = null;
      if (searchable) {
        timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      }

      return () => {
        if (timer) clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleReposition, true);
        window.removeEventListener('resize', handleReposition);
      };
    }, [isOpen, searchable]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            handleOpen();
          }
          return;
        }
        if (event.key === 'Escape') handleClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // ── Option renderer ───────────────────────────────────────────────────────

    /**
     * WHY inline styles?
     * Tailwind's JIT/purge can strip utility classes that appear only inside
     * dynamic expressions (.map, conditional cn() calls).  Using inline styles
     * as the primary source of truth for color/background guarantees the text
     * is always visible regardless of build configuration.
     * Tailwind classes are kept only for layout/spacing where purging has no
     * visible impact.
     */
    const renderOptions = () => {
      if (loading) {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid #d1d5db',
                borderTopColor: '#2563eb',
                animation: 'spin 0.75s linear infinite',
              }}
            />
          </div>
        );
      }

      if (filteredOptions.length === 0) {
        return (
          <div
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            No options available
          </div>
        );
      }

      return filteredOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <div
            key={option.value}
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled}
            onClick={() => handleSelect(option.value, option.disabled)}
            className={cn(optionClassName)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 1rem',
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              opacity: option.disabled ? 0.5 : 1,
              backgroundColor: isSelected ? '#eff6ff' : 'transparent',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!option.disabled) {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  isSelected ? '#dbeafe' : '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                isSelected ? '#eff6ff' : 'transparent';
            }}
          >
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                color: isSelected ? '#2563eb' : '#111827',
                fontWeight: isSelected ? 500 : 400,
              }}
            >
              {option.label}
            </span>
            {isSelected && (
              <Check
                style={{
                  flexShrink: 0,
                  marginLeft: '0.5rem',
                  width: 16,
                  height: 16,
                  color: '#2563eb',
                }}
              />
            )}
          </div>
        );
      });
    };

    // ── Shared dropdown content ───────────────────────────────────────────────

    const dropdownContent = (
      <>
        {searchable && (
          <div
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #f3f4f6',
              padding: '0.5rem',
              zIndex: 1,
            }}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                color: '#111827',
                backgroundColor: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(59,130,246,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        )}
        <div role="listbox">{renderOptions()}</div>
      </>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <div ref={containerRef} className={cn('w-full', className)}>
        {/* Label */}
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {label}
            {required && (
              <span style={{ marginLeft: '0.25rem', color: '#ef4444' }}>*</span>
            )}
          </label>
        )}

        {/* Trigger */}
        <div ref={ref} className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={handleOpen}
            disabled={disabled || loading}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={error}
            aria-required={required}
            className={cn(triggerClassName)}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '0.5rem',
              border: `1px solid ${
                error ? '#ef4444' : isOpen ? '#3b82f6' : '#d1d5db'
              }`,
              padding: '0.625rem 1rem',
              textAlign: 'left',
              fontSize: '0.875rem',
              backgroundColor: disabled ? '#f9fafb' : '#ffffff',
              color: disabled ? '#9ca3af' : '#111827',
              cursor: disabled ? 'not-allowed' : 'pointer',
              outline: 'none',
              boxShadow: isOpen
                ? error
                  ? '0 0 0 3px rgba(239,68,68,0.15)'
                  : '0 0 0 3px rgba(59,130,246,0.15)'
                : 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: selectedLabel
                  ? disabled
                    ? '#9ca3af'
                    : '#111827'
                  : '#9ca3af',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '2px solid #d1d5db',
                      borderTopColor: '#2563eb',
                      animation: 'spin 0.75s linear infinite',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: '#6b7280' }}>Loading...</span>
                </span>
              ) : (
                selectedLabel || placeholder
              )}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {clearable && value && !disabled && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear selection"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    borderRadius: 4,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = '#f3f4f6')
                  }
                  onMouseLeave={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = 'transparent')
                  }
                >
                  <X style={{ width: 14, height: 14, color: '#9ca3af' }} />
                </button>
              )}
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  color: '#9ca3af',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                }}
              />
            </div>
          </button>

          {/* Dropdown */}
          {isOpen &&
            (portal ? (
              <DropdownPortal
                rect={triggerRect}
                maxHeight={maxHeight}
                dropdownClassName={dropdownClassName}
                dropdownRef={dropdownRef}
              >
                {dropdownContent}
              </DropdownPortal>
            ) : (
              <div
                ref={dropdownRef}
                className={dropdownClassName}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  marginTop: 4,
                  maxHeight,
                  overflowY: 'auto',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  boxShadow:
                    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                }}
              >
                {dropdownContent}
              </div>
            ))}
        </div>

        {/* Description */}
        {description && !error && (
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
            {description}
          </p>
        )}

        {/* Error Message */}
        {error && errorMessage && (
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#ef4444' }}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;