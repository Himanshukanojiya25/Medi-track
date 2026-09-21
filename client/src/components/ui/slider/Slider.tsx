// client/src/components/ui/slider/Slider.tsx
import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  /** Current value (single or range) */
  value?: number | [number, number];
  /** Default value (uncontrolled) */
  defaultValue?: number | [number, number];
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Orientation of the slider */
  orientation?: SliderOrientation;
  /** Size of the slider */
  size?: SliderSize;
  /** Whether slider is disabled */
  disabled?: boolean;
  /** Whether to show value tooltip */
  showTooltip?: boolean;
  /** Format function for tooltip/value display */
  formatValue?: (value: number) => string;
  /** Callback when value changes */
  onValueChange?: (value: number | [number, number]) => void;
  /** Callback when value change is committed (on mouse up) */
  onValueCommit?: (value: number | [number, number]) => void;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA labelled by for accessibility */
  ariaLabelledBy?: string;
}

interface SliderContextValue {
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
  size: SliderSize;
  disabled: boolean;
  isRange: boolean;
  values: number[];
  setValues: (values: number[]) => void;
  getPercentage: (value: number) => number;
  getValueFromPercentage: (percentage: number) => number;
  formatValue: (value: number) => string;
  activeThumb: number | null;
  setActiveThumb: (index: number | null) => void;
}

const SliderContext = createContext<SliderContextValue | null>(null);

const useSliderContext = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('Slider components must be used within a Slider');
  }
  return context;
};

// ============================================================================
// UTILITIES
// ============================================================================

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const snapToStep = (value: number, step: number, min: number): number => {
  if (step === 0) return value;
  const steps = Math.round((value - min) / step);
  return min + steps * step;
};

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  value: number;
  orientation: SliderOrientation;
  isVisible: boolean;
  formatValue: (value: number) => string;
  style?: React.CSSProperties;
}

const Tooltip: React.FC<TooltipProps> = ({ value, orientation, isVisible, formatValue, style }) => {
  if (!isVisible) return null;
  
  return (
    <div
      className={cn(
        'absolute z-10 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg dark:bg-gray-700',
        orientation === 'horizontal' ? '-top-8 left-1/2 -translate-x-1/2' : '-left-8 top-1/2 -translate-y-1/2'
      )}
      style={style}
      role="tooltip"
    >
      {formatValue(value)}
      <div
        className={cn(
          'absolute h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700',
          orientation === 'horizontal' ? '-bottom-1 left-1/2 -translate-x-1/2' : '-right-1 top-1/2 -translate-y-1/2'
        )}
      />
    </div>
  );
};

// ============================================================================
// THUMB COMPONENT
// ============================================================================

interface ThumbProps {
  index: number;
  value: number;
}

const Thumb: React.FC<ThumbProps> = ({ index, value }) => {
  const {
    orientation,
    size,
    disabled,
    getPercentage,
    formatValue,
    activeThumb,
    setActiveThumb,
    isRange,
  } = useSliderContext();
  
  const [showTooltip, setShowTooltip] = useState(false);
  const isActive = activeThumb === index;
  
  const percentage = getPercentage(value);
  
  const positionStyle = orientation === 'horizontal'
    ? { left: `${percentage}%`, transform: 'translateX(-50%)' }
    : { bottom: `${percentage}%`, transform: 'translateY(50%)' };
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const handleMouseEnter = () => {
    if (!disabled) setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  const handleFocus = () => {
    setActiveThumb(index);
    setShowTooltip(true);
  };
  
  const handleBlur = () => {
    setActiveThumb(null);
    setShowTooltip(false);
  };
  
  return (
    <div
      className={cn(
        'absolute cursor-grab rounded-full border-2 border-white bg-primary shadow-md transition-all active:cursor-grabbing',
        sizeClasses[size],
        disabled && 'cursor-not-allowed bg-gray-400',
        isActive && 'ring-2 ring-primary ring-offset-2'
      )}
      style={positionStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      aria-label={`Thumb ${index + 1}`}
      aria-disabled={disabled}
    >
      <Tooltip
        value={value}
        orientation={orientation}
        isVisible={showTooltip || isActive}
        formatValue={formatValue}
      />
    </div>
  );
};

// ============================================================================
// TRACK COMPONENT
// ============================================================================

const Track: React.FC = () => {
  const { orientation, disabled } = useSliderContext();
  
  return (
    <div
      className={cn(
        'relative rounded-full bg-gray-200 dark:bg-gray-700',
        orientation === 'horizontal' ? 'h-1.5 w-full' : 'h-full w-1.5',
        disabled && 'opacity-50'
      )}
    />
  );
};

// ============================================================================
// RANGE COMPONENT
// ============================================================================

const Range: React.FC = () => {
  const { orientation, values, getPercentage, isRange } = useSliderContext();
  
  if (!isRange || values.length !== 2) return null;
  
  const startPercent = getPercentage(values[0]);
  const endPercent = getPercentage(values[1]);
  
  const rangeStyle = orientation === 'horizontal'
    ? { left: `${startPercent}%`, width: `${endPercent - startPercent}%` }
    : { bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` };
  
  return (
    <div
      className="absolute rounded-full bg-primary"
      style={rangeStyle}
    />
  );
};

// ============================================================================
// MAIN SLIDER COMPONENT
// ============================================================================

export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  size = 'md',
  disabled = false,
  showTooltip = true,
  formatValue: customFormatValue,
  onValueChange,
  onValueCommit,
  className = '',
  ariaLabel,
  ariaLabelledBy,
}) => {
  // State management
  const isControlled = controlledValue !== undefined;
  const isRange = Array.isArray(controlledValue ?? defaultValue);
  
  const getInitialValues = (): number[] => {
    const initial = isControlled ? controlledValue : defaultValue;
    if (Array.isArray(initial)) {
      return [clamp(initial[0], min, max), clamp(initial[1], min, max)];
    }
    return [clamp(initial ?? min, min, max)];
  };
  
  const [internalValues, setInternalValues] = useState<number[]>(getInitialValues);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const values = isControlled 
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue]) as number[]
    : internalValues;
  
  const formatValue = useCallback((val: number): string => {
    if (customFormatValue) return customFormatValue(val);
    if (step >= 1) return val.toString();
    return val.toFixed(1);
  }, [customFormatValue, step]);
  
  const getPercentage = useCallback((value: number): number => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);
  
  const getValueFromPercentage = useCallback((percentage: number): number => {
    const rawValue = min + (percentage / 100) * (max - min);
    let snappedValue = snapToStep(rawValue, step, min);
    snappedValue = clamp(snappedValue, min, max);
    return parseFloat(snappedValue.toFixed(10));
  }, [min, max, step]);
  
  const updateValues = useCallback((newValues: number[], shouldCommit = false) => {
    const sortedValues = [...newValues].sort((a, b) => a - b);
    
    if (!isControlled) {
      setInternalValues(sortedValues);
    }
    
    const returnValue: number | [number, number] = isRange
      ? [sortedValues[0], sortedValues[1]]
      : sortedValues[0];
    
    onValueChange?.(returnValue);
    
    if (shouldCommit) {
      onValueCommit?.(returnValue);
    }
  }, [isControlled, isRange, onValueChange, onValueCommit]);
  
  const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!sliderRef.current || !isDragging.current || activeThumb === null || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    let percentage: number;
    if (orientation === 'horizontal') {
      const offsetX = clientX - rect.left;
      percentage = clamp((offsetX / rect.width) * 100, 0, 100);
    } else {
      const offsetY = rect.bottom - clientY;
      percentage = clamp((offsetY / rect.height) * 100, 0, 100);
    }
    
    const newValue = getValueFromPercentage(percentage);
    const newValues = [...values];
    newValues[activeThumb] = newValue;
    
    // Ensure range values don't cross
    if (isRange && values.length === 2) {
      if (activeThumb === 0 && newValue > values[1]) {
        newValues[0] = values[1];
        newValues[1] = newValue;
        setActiveThumb(1);
      } else if (activeThumb === 1 && newValue < values[0]) {
        newValues[1] = values[0];
        newValues[0] = newValue;
        setActiveThumb(0);
      }
    }
    
    updateValues(newValues, false);
  }, [activeThumb, disabled, getValueFromPercentage, orientation, values, isRange, updateValues]);
  
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    updateValues(values, true);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  }, [values, handleMouseMove, updateValues]);
  
  const handleMouseDown = useCallback((index: number) => (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (disabled) return;
    
    setActiveThumb(index);
    isDragging.current = true;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
  }, [disabled, handleMouseMove, handleMouseUp]);
  
  const handleTrackClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let percentage: number;
    if (orientation === 'horizontal') {
      const offsetX = event.clientX - rect.left;
      percentage = clamp((offsetX / rect.width) * 100, 0, 100);
    } else {
      const offsetY = rect.bottom - event.clientY;
      percentage = clamp((offsetY / rect.height) * 100, 0, 100);
    }
    
    const newValue = getValueFromPercentage(percentage);
    let newValues: number[];
    
    if (isRange && values.length === 2) {
      // Find closest thumb
      const distToFirst = Math.abs(newValue - values[0]);
      const distToSecond = Math.abs(newValue - values[1]);
      const thumbIndex = distToFirst <= distToSecond ? 0 : 1;
      newValues = [...values];
      newValues[thumbIndex] = newValue;
      
      // Ensure order
      if (newValues[0] > newValues[1]) {
        newValues = [newValues[1], newValues[0]];
      }
    } else {
      newValues = [newValue];
    }
    
    updateValues(newValues, true);
  }, [disabled, getValueFromPercentage, isRange, orientation, updateValues, values]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDragging.current) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [handleMouseMove, handleMouseUp]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((index: number) => (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -step : 
                  event.key === 'ArrowRight' || event.key === 'ArrowUp' ? step : 0;
    
    if (delta !== 0) {
      event.preventDefault();
      const newValues = [...values];
      newValues[index] = clamp(values[index] + delta, min, max);
      updateValues(newValues, true);
    }
    
    // Home/End keys
    if (event.key === 'Home') {
      event.preventDefault();
      const newValues = [...values];
      newValues[index] = min;
      updateValues(newValues, true);
    }
    
    if (event.key === 'End') {
      event.preventDefault();
      const newValues = [...values];
      newValues[index] = max;
      updateValues(newValues, true);
    }
  }, [disabled, step, values, min, max, updateValues]);
  
  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-32 w-fit',
  };
  
  const containerClasses = {
    horizontal: 'flex items-center',
    vertical: 'flex justify-center',
  };
  
  const contextValue: SliderContextValue = {
    min,
    max,
    step,
    orientation,
    size,
    disabled,
    isRange,
    values,
    setValues: updateValues,
    getPercentage,
    getValueFromPercentage,
    formatValue,
    activeThumb,
    setActiveThumb,
  };
  
  return (
    <SliderContext.Provider value={contextValue}>
      <div
        className={cn(containerClasses[orientation], className)}
        style={{ touchAction: 'none' }}
      >
        <div
          ref={sliderRef}
          className={cn(
            'relative select-none',
            orientationClasses[orientation],
            orientation === 'vertical' && 'h-full'
          )}
          onClick={handleTrackClick}
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          <Track />
          <Range />
          {values.map((value, index) => (
            <div
              key={index}
              onMouseDown={handleMouseDown(index)}
              onTouchStart={handleMouseDown(index)}
              onKeyDown={handleKeyDown(index)}
            >
              <Thumb index={index} value={value} />
            </div>
          ))}
        </div>
      </div>
    </SliderContext.Provider>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default Slider;