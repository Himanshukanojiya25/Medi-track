// client/src/components/ui/input/Input.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, fullWidth = true, disabled, type = 'text', ...props }, ref) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border px-4 py-2.5 text-sm",
            "bg-white text-gray-900", // ✅ Fixed: White background, dark text
            "placeholder:text-gray-400",
            "border-gray-300",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;