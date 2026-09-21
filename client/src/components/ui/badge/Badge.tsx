// client/src/components/ui/badge/Badge.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'info' 
  | 'light' 
  | 'dark'
  | 'outline';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export type BadgeShape = 'rounded' | 'pill' | 'square';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Shape of the badge */
  shape?: BadgeShape;
  /** Whether badge is clickable */
  clickable?: boolean;
  /** Whether badge is removable (shows close icon) */
  removable?: boolean;
  /** Callback when remove icon is clicked */
  onRemove?: () => void;
  /** Icon to display before content */
  icon?: React.ReactNode;
  /** Icon to display after content */
  rightIcon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler (when clickable is true) */
  onClick?: () => void;
  /** Whether badge is disabled */
  disabled?: boolean;
  /** Whether to show a dot indicator */
  dot?: boolean;
  /** Dot color (overrides variant) */
  dotColor?: string;
  /** Maximum width (for long content) */
  maxWidth?: string | number;
  /** Whether to truncate text */
  truncate?: boolean;
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground',
  secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  light: 'bg-white text-gray-800 border border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700',
  dark: 'bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-200',
  outline: 'border border-current bg-transparent text-current',
};

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] font-medium',
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-2.5 py-1 text-sm font-medium',
  lg: 'px-3 py-1.5 text-base font-semibold',
};

// ============================================================================
// SHAPE STYLES
// ============================================================================

const shapeStyles: Record<BadgeShape, string> = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
  square: 'rounded-none',
};

// ============================================================================
// DOT STYLES
// ============================================================================

const dotVariantColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  light: 'bg-gray-400',
  dark: 'bg-gray-600',
  outline: 'bg-current',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'pill',
  clickable = false,
  removable = false,
  onRemove,
  icon,
  rightIcon,
  className = '',
  onClick,
  disabled = false,
  dot = false,
  dotColor,
  maxWidth,
  truncate = false,
}) => {
  const isInteractive = clickable || removable;
  
  const handleClick = () => {
    if (disabled) return;
    if (clickable && onClick) onClick();
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (onRemove) onRemove();
  };
  
  const dotBackgroundColor = dotColor || (variant !== 'outline' ? dotVariantColors[variant] : 'currentColor');
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        isInteractive && !disabled && 'cursor-pointer hover:opacity-80 active:scale-95',
        disabled && 'cursor-not-allowed opacity-50',
        truncate && 'overflow-hidden text-ellipsis whitespace-nowrap',
        className
      )}
      onClick={handleClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{ maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined }}
    >
      {/* Dot Indicator */}
      {dot && (
        <span
          className={cn(
            'inline-block h-2 w-2 rounded-full',
            size === 'xs' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2'
          )}
          style={{ backgroundColor: dotBackgroundColor }}
          aria-hidden="true"
        />
      )}
      
      {/* Left Icon */}
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {/* Content */}
      <span className={cn(truncate && 'truncate')}>
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && !removable && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className={cn(
            'ml-0.5 flex-shrink-0 rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10',
            disabled && 'cursor-not-allowed'
          )}
          aria-label="Remove"
        >
          <svg
            className={cn(
              'h-3 w-3',
              size === 'xs' ? 'h-2 w-2' : size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// ============================================================================
// PRESET BADGES
// ============================================================================

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'scheduled';
  size?: BadgeSize;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showDot = true,
  className = '',
}) => {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    scheduled: { variant: 'info', label: 'Scheduled' },
  };
  
  const config = statusConfig[status] || { variant: 'default', label: status };
  
  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={showDot}
      className={cn('capitalize', className)}
    >
      {config.label}
    </Badge>
  );
};

export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  showPlus?: boolean;
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'primary',
  size = 'sm',
  showPlus = true,
  className = '',
}) => {
  const displayCount = count > max ? (showPlus ? `${max}+` : `${max}`) : count.toString();
  
  return (
    <Badge variant={variant} size={size} className={cn('px-1.5 font-mono', className)}>
      {displayCount}
    </Badge>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default Badge;