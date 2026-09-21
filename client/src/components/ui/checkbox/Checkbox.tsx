// client/src/components/ui/checkbox/Checkbox.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text shown next to the checkbox */
  label?: string;
  /** Optional helper text rendered below the label */
  description?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Accessible checkbox with optional label and description.
 *
 * Uses a stable generated id so that the <label> htmlFor always matches
 * the input id, enabling click-on-label behaviour.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, description, checked, onChange, disabled, id, ...props },
    ref,
  ) => {
    // Use provided id; otherwise generate a stable one via useId (React 18+).
    // For React < 18 we fall back to a random string — still unique enough for
    // a single render session.
    const generatedId = React.useId?.() ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;
    const checkboxId = id ?? generatedId;

    return (
      <div className="flex items-start gap-2">
        {/* Hidden native checkbox — styled via peer */}
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'h-4 w-4 rounded border-gray-300',
              'text-blue-600',
              'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'cursor-pointer',
              className,
            )}
            {...props}
          />
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm select-none',
              disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700',
            )}
          >
            {label}
            {description && (
              <span className="mt-0.5 block text-xs text-gray-500">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;