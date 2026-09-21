// client/src/components/ui/form/Form.tsx
import React from 'react';
import { 
  FormProvider, 
  useFormContext, 
  Controller, 
  ControllerProps, 
  FieldPath, 
  FieldValues 
} from 'react-hook-form';
import { cn } from '../../../lib/utils';

// ============================================================================
// MAIN FORM COMPONENT
// ============================================================================

export const Form = FormProvider;

// ============================================================================
// FORM FIELD (Using Controller)
// ============================================================================

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />;
};

// ============================================================================
// FORM ITEM
// ============================================================================

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    const [isError, setIsError] = React.useState(false);
    
    return (
      <div 
        ref={ref} 
        className={cn("space-y-2 mb-4", className)} 
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === FormLabel) {
            return React.cloneElement(child as React.ReactElement, { isError });
          }
          if (React.isValidElement(child) && child.type === FormMessage) {
            return React.cloneElement(child as React.ReactElement, { setIsError });
          }
          return child;
        })}
      </div>
    );
  }
);
FormItem.displayName = "FormItem";

// ============================================================================
// FORM LABEL
// ============================================================================

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  isError?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, isError, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          isError ? "text-red-600" : "text-gray-700",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = "FormLabel";

// ============================================================================
// FORM CONTROL
// ============================================================================

interface FormControlProps {
  children: React.ReactNode;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);
FormControl.displayName = "FormControl";

// ============================================================================
// FORM DESCRIPTION
// ============================================================================

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xs text-gray-500", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormDescription.displayName = "FormDescription";

// ============================================================================
// FORM MESSAGE (with error handling)
// ============================================================================

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
  setIsError?: (value: boolean) => void;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, setIsError, ...props }, ref) => {
    // Get error from react-hook-form context if available
    const ctx = useFormContext();
    const error = ctx?.formState?.errors;
    
    React.useEffect(() => {
      if (setIsError) {
        setIsError(!!children);
      }
    }, [children, setIsError]);
    
    if (!children) return null;
    
    return (
      <p
        ref={ref}
        className={cn("text-xs text-red-600 font-medium", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

// ============================================================================
// FORM SECTION (Optional - for grouping)
// ============================================================================

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {(title || description) && (
          <div className="space-y-1">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}
        {children}
      </div>
    );
  }
);
FormSection.displayName = "FormSection";

// ============================================================================
// FORM ACTIONS (for buttons)
// ============================================================================

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = "end", children, ...props }, ref) => {
    const alignClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    };
    
    return (
      <div
        ref={ref}
        className={cn("flex gap-3 pt-4 border-t border-gray-200", alignClasses[align], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormActions.displayName = "FormActions";

// ============================================================================
// USE FORM FIELD HOOK (to get field state)
// ============================================================================

export const useFormField = () => {
  const formContext = useFormContext();
  const fieldContext = React.useContext(FormFieldContext);
  
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  
  const { name } = fieldContext;
  const { getFieldState, formState } = formContext;
  const fieldState = getFieldState(name, formState);
  
  return {
    name,
    error: fieldState.error,
    isInvalid: !!fieldState.error,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
  };
};

// Context for form field
const FormFieldContext = React.createContext<{ name: string } | null>(null);

// Wrapper for FormField with context
export const FormFieldWithContext = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  children,
  ...props
}: ControllerProps<TFieldValues, TName> & { children?: React.ReactNode }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormSection,
  FormActions,
  useFormField,
};