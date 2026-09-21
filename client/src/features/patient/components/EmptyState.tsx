// client/src/features/patient/components/EmptyState.tsx
import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

export type EmptyStateVariant = 'default' | 'compact' | 'centered';

export interface EmptyStateAction {
  /** Action label */
  label: string;
  /** Action click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export interface EmptyStateProps {
  /** Title of the empty state */
  title: string;
  /** Description message */
  description?: string;
  /** Icon component (optional) */
  icon?: React.ReactNode;
  /** Custom illustration/image URL */
  illustration?: string;
  /** Actions to display */
  actions?: EmptyStateAction[];
  /** Variant of the empty state */
  variant?: EmptyStateVariant;
  /** Additional CSS classes */
  className?: string;
  /** Children (custom content) */
  children?: React.ReactNode;
}

// ============================================================================
// DEFAULT ICONS
// ============================================================================

const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const NoDataIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// ============================================================================
// PRESET EMPTY STATES
// ============================================================================

export const EmptyStatePresets = {
  noData: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No data found',
    description: props?.description || 'There is no data available to display at the moment.',
    icon: <NoDataIcon className="h-12 w-12" />,
    ...props,
  }),
  
  noResults: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No results found',
    description: props?.description || 'We couldn\'t find any results matching your search criteria. Try adjusting your filters.',
    icon: <SearchIcon className="h-12 w-12" />,
    ...props,
  }),
  
  noAppointments: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No appointments',
    description: props?.description || 'You don\'t have any appointments scheduled. Book your first appointment now.',
    icon: <DefaultIcon className="h-12 w-12" />,
    ...props,
  }),
  
  noFavorites: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No favorites yet',
    description: props?.description || 'Start adding doctors and hospitals to your favorites for quick access.',
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    ...props,
  }),
  
  noNotifications: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No notifications',
    description: props?.description || 'You\'re all caught up! Check back later for updates.',
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    ...props,
  }),
  
  noMedicalHistory: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No medical history',
    description: props?.description || 'Your medical history will appear here once you add it.',
    icon: <DefaultIcon className="h-12 w-12" />,
    ...props,
  }),
  
  noPrescriptions: (props?: Partial<EmptyStateProps>): EmptyStateProps => ({
    title: props?.title || 'No prescriptions',
    description: props?.description || 'Your prescriptions will appear here after your appointments.',
    icon: (
      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    ...props,
  }),
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  illustration,
  actions = [],
  variant = 'centered',
  className = '',
  children,
}) => {
  // ============================================================================
  // VARIANT STYLES
  // ============================================================================
  const variantStyles = {
    default: 'p-6',
    compact: 'p-4',
    centered: 'p-8 flex flex-col items-center justify-center text-center',
  };

  const contentStyles = {
    default: 'flex items-start gap-4',
    compact: 'flex items-center gap-3',
    centered: 'flex flex-col items-center gap-4',
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      <div className={contentStyles[variant]}>
        {/* Icon / Illustration */}
        {(icon || illustration) && (
          <div className={cn(
            'flex-shrink-0 text-gray-400 dark:text-gray-500',
            variant === 'centered' && 'mb-2'
          )}>
            {illustration ? (
              <img src={illustration} alt="" className="h-24 w-24 object-contain" />
            ) : (
              <div className={cn(
                'rounded-full',
                variant === 'compact' ? 'p-1' : 'p-2',
                variant === 'centered' && 'bg-gray-100 p-4 dark:bg-gray-800'
              )}>
                {icon || <DefaultIcon className="h-8 w-8" />}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          variant === 'centered' ? 'text-center' : 'flex-1'
        )}>
          <h3 className={cn(
            'font-semibold text-gray-900 dark:text-white',
            variant === 'compact' ? 'text-sm' : 'text-base',
            variant === 'centered' && 'text-lg'
          )}>
            {title}
          </h3>
          
          {description && (
            <p className={cn(
              'mt-1 text-gray-500 dark:text-gray-400',
              variant === 'compact' ? 'text-xs' : 'text-sm'
            )}>
              {description}
            </p>
          )}
          
          {children && (
            <div className={cn(
              'mt-3',
              variant === 'compact' ? 'text-xs' : 'text-sm'
            )}>
              {children}
            </div>
          )}
          
          {/* Actions */}
          {actions.length > 0 && (
            <div className={cn(
              'mt-4 flex flex-wrap gap-2',
              variant === 'centered' && 'justify-center'
            )}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size={variant === 'compact' ? 'sm' : 'default'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default EmptyState;