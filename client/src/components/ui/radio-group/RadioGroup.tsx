// client/src/components/ui/radio-group/RadioGroup.tsx
import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../../lib/utils';

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  className = '',
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) setUncontrolledValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-2", className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, id, disabled, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    const isChecked = context?.value === value;
    const radioId = id || `radio-${value}`;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={() => context?.onValueChange(value)}
          className={cn(
            "w-4 h-4 text-blue-600 bg-white dark:bg-gray-900",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className={cn(
              "ml-2 text-sm",
              disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 cursor-pointer"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export const RadioGroupLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  className,
  children,
  ...props
}) => (
  <label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block", className)} {...props}>
    {children}
  </label>
);
RadioGroupLabel.displayName = 'RadioGroupLabel';