// client/src/components/ui/switch/Switch.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, label }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            checked ? "bg-blue-600" : "bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        {label && (
          <span className={cn("text-sm", disabled ? "text-gray-400" : "text-gray-700")}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
export default Switch;