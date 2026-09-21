// client/src/components/ui/popover/Popover.tsx
import React, { useState, useRef, useEffect, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../lib/utils';

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>; // ✅ Changed to MutableRefObject
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null); // ✅ useRef returns MutableRefObject

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setUncontrolledOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

export interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild = false }) => {
  const context = React.useContext(PopoverContext);
  const localRef = useRef<HTMLElement | null>(null);

  const handleClick = () => context?.setOpen(!context.open);

  // Update the context ref when local ref changes
  useEffect(() => {
    if (context?.triggerRef && localRef.current) {
      context.triggerRef.current = localRef.current;
    }
  }, [context]);

  // Handle ref assignment safely
  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;
    if (context?.triggerRef) {
      context.triggerRef.current = node;
    }
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      ref: setRefs,
    });
  }

  return (
    <div ref={setRefs} onClick={handleClick}>
      {children}
    </div>
  );
};
PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  children: React.ReactNode;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  className = '',
  align = 'center',
  side = 'bottom',
  sideOffset = 8,
  children,
}) => {
  const context = React.useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (context?.open && context.triggerRef?.current && contentRef.current) {
        const triggerRect = context.triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (side) {
          case 'top':
            top = triggerRect.top - contentRect.height - sideOffset;
            break;
          case 'bottom':
            top = triggerRect.bottom + sideOffset;
            break;
          case 'left':
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            left = triggerRect.left - contentRect.width - sideOffset;
            break;
          case 'right':
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            left = triggerRect.right + sideOffset;
            break;
        }

        switch (align) {
          case 'start':
            if (side === 'top' || side === 'bottom') left = triggerRect.left;
            break;
          case 'center':
            if (side === 'top' || side === 'bottom') {
              left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            }
            break;
          case 'end':
            if (side === 'top' || side === 'bottom') left = triggerRect.right - contentRect.width;
            break;
        }

        setPosition({ top: top + window.scrollY, left: left + window.scrollX });
      }
    };

    if (context?.open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [context?.open, side, align, sideOffset, context?.triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        context?.triggerRef?.current &&
        !context.triggerRef.current.contains(event.target as Node)
      ) {
        context?.setOpen(false);
      }
    };

    if (context?.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context?.open]);

  if (!context?.open) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={cn(
        "z-50 min-w-[200px] rounded-lg border shadow-lg",
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
        "animate-in fade-in zoom-in duration-200",
        className
      )}
      style={{ position: 'absolute', top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body
  );
};
PopoverContent.displayName = 'PopoverContent';

export default Popover;