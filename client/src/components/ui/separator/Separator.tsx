// client/src/components/ui/separator/Separator.tsx
import React from 'react';
import { cn } from '../../../lib/utils';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, className }, ref) => {
    return (
      <hr
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-gray-200 dark:bg-gray-700",
          orientation === 'horizontal' ? "h-px w-full my-4" : "h-auto w-px mx-4",
          className
        )}
      />
    );
  }
);

Separator.displayName = 'Separator';
export default Separator;