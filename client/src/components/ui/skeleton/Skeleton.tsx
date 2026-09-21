// client/src/components/ui/select/Select.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, defaultValue, onValueChange, children }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const setValue = (newValue: string) => {
    if (value === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };
  
  return (
    <SelectContext.Provider value={{ open, setOpen, value: currentValue, setValue }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  error?: boolean;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, error, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context?.setOpen(!context.open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm",
          "bg-white text-gray-900",
          "border-gray-300",
          "hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", context?.open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  return <span className={!context?.value ? "text-gray-400" : "text-gray-900"}>{context?.value || placeholder}</span>;
};

export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = React.useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        context?.setOpen(false);
      }
    };
    
    if (context?.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [context?.open]);
  
  if (!context?.open) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border",
        "bg-white py-1 shadow-lg",
        "border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const context = React.useContext(SelectContext);
  const isSelected = context?.value === value;
  
  return (
    <div
      onClick={() => context?.setValue(value)}
      className={cn(
        "relative flex cursor-pointer items-center px-3 py-2 text-sm",
        "hover:bg-gray-100",
        isSelected && "bg-blue-50 text-blue-600",
        !isSelected && "text-gray-700"
      )}
    >
      <span className="flex-1">{children}</span>
      {isSelected && <Check className="h-4 w-4" />}
    </div>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
SelectValue.displayName = 'SelectValue';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';

export default Select;