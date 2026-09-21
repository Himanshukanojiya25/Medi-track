// client/src/components/ui/button/Button.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ButtonVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive' 
  | 'success' 
  | 'warning' 
  | 'info';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Makes button take full width of container */
  fullWidth?: boolean;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Adds left icon */
  leftIcon?: React.ReactNode;
  /** Adds right icon */
  rightIcon?: React.ReactNode;
  /** Renders as child component (for React Router Link, etc.) */
  asChild?: boolean;
  /** Loading text to show instead of children */
  loadingText?: string;
}

// ============================================================================
// STYLES CONFIGURATION
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm',
  info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1',
  sm: 'px-3 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-5 py-3 text-base rounded-lg gap-2',
  xl: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
};

const baseStyles = `
  inline-flex items-center justify-center 
  font-medium 
  transition-all duration-200 ease-in-out 
  focus:outline-none focus:ring-2 focus:ring-offset-2 
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  active:scale-[0.98]
  select-none
  relative
`;

// ============================================================================
// SPINNER COMPONENT
// ============================================================================

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
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
);

// ============================================================================
// MAIN BUTTON COMPONENT
// ============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      asChild = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const showLoading = loading;
    const content = showLoading && loadingText ? loadingText : children;
    const showLeftIcon = leftIcon && !showLoading;
    const showRightIcon = rightIcon && !showLoading;

    // Convert boolean to string for ARIA attributes (to satisfy Edge Tools)
    const ariaBusyValue = loading ? 'true' : 'false';
    const ariaDisabledValue = isDisabled ? 'true' : 'false';

    // If asChild is true, render as child component
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        className: cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        ),
        disabled: isDisabled,
        'aria-busy': ariaBusyValue,
        'aria-disabled': ariaDisabledValue,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        aria-busy={ariaBusyValue}
        aria-disabled={ariaDisabledValue}
        {...props}
      >
        {/* Loading Spinner */}
        {showLoading && (
          <Spinner className={cn("mr-2", size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
        )}

        {/* Left Icon */}
        {showLeftIcon && (
          <span className={cn("inline-flex shrink-0", children && "mr-2")}>
            {leftIcon}
          </span>
        )}

        {/* Button Content */}
        <span className="inline-flex items-center gap-1">{content}</span>

        {/* Right Icon */}
        {showRightIcon && (
          <span className={cn("inline-flex shrink-0", children && "ml-2")}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// ICON BUTTON COMPONENT
// ============================================================================

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', 'aria-label': ariaLabel, ...props }, ref) => {
    const iconSizes: Record<ButtonSize, string> = {
      xs: 'h-3 w-3',
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
    };

    const buttonSizes: Record<ButtonSize, string> = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const isDisabled = props.disabled || props.loading || false;
    const ariaBusyValue = props.loading ? 'true' : 'false';
    const ariaDisabledValue = isDisabled ? 'true' : 'false';

    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(buttonSizes[size], props.className)}
        aria-label={ariaLabel}
        aria-busy={ariaBusyValue}
        aria-disabled={ariaDisabledValue}
        {...props}
      >
        <span className={iconSizes[size]} aria-hidden="true">
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ============================================================================
// BUTTON GROUP COMPONENT
// ============================================================================

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  role?: string;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = 'horizontal', spacing = 'md', className, role = 'group', ...props }, ref) => {
    const spacingStyles = {
      horizontal: {
        sm: 'space-x-1',
        md: 'space-x-2',
        lg: 'space-x-3',
      },
      vertical: {
        sm: 'space-y-1',
        md: 'space-y-2',
        lg: 'space-y-3',
      },
    };

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          spacingStyles[orientation][spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default Button;