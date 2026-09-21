// client/src/components/ui/textarea/Textarea.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  rows?: number;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, fullWidth = true, disabled, ...props }, ref) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            // Base styles - CRITICAL FOR TEXT VISIBILITY
            "block rounded-lg border shadow-sm transition-all duration-200",
            "text-gray-900 dark:text-white", // 👈 TEXT COLOR FIX
            "placeholder:text-gray-400 dark:placeholder:text-gray-500", // 👈 PLACEHOLDER COLOR
            "bg-white dark:bg-gray-900", // 👈 BACKGROUND COLOR
            
            // Border & Focus styles
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500",
            
            // Size styles
            "px-4 py-2.5 text-sm",
            
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            
            // Disabled styles
            "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-800",
            
            // Resize
            "resize-y",
            
            // Full width
            fullWidth && "w-full",
            
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;