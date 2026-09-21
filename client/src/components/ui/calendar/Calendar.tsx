// client/src/components/ui/calendar/Calendar.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface CalendarProps {
  mode?: 'single' | 'range' | 'multiple';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
  numberOfMonths?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const Calendar: React.FC<CalendarProps> = ({
  mode = 'single',
  selected,
  onSelect,
  disabled,
  className = '',
  initialFocus = false,
  numberOfMonths = 1,
  weekStartsOn = 0,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selected instanceof Date ? selected : new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const weekDays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (weekStartsOn === 1) {
      days.push(days.shift()!);
    }
    return days;
  }, [weekStartsOn]);

  const months = useMemo(() => 
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  []);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    
    const startDayOfWeek = firstDay.getDay();
    const offset = (startDayOfWeek - weekStartsOn + 7) % 7;
    
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [weekStartsOn]);

  const isSelected = useCallback((date: Date) => {
    if (!selected) return false;
    if (selected instanceof Date) return selected.toDateString() === date.toDateString();
    if (Array.isArray(selected)) return selected.some(d => d.toDateString() === date.toDateString());
    if ('from' in selected && 'to' in selected) {
      if (selected.from && selected.to) {
        return date >= selected.from && date <= selected.to;
      }
      return selected.from?.toDateString() === date.toDateString();
    }
    return false;
  }, [selected]);

  const isInRange = useCallback((date: Date) => {
    if (mode !== 'range') return false;
    if (!selected || !('from' in selected) || !selected.from) return false;
    if (!selected.to && hoveredDate) {
      return date > selected.from && date < hoveredDate;
    }
    if (selected.from && selected.to) {
      return date > selected.from && date < selected.to;
    }
    return false;
  }, [mode, selected, hoveredDate]);

  const isDisabled = useCallback((date: Date) => {
    if (disabled) return disabled(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }, [disabled]);

  const handleDateSelect = useCallback((date: Date) => {
    if (isDisabled(date)) return;
    onSelect?.(date);
  }, [isDisabled, onSelect]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={cn("p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <span className="text-base font-semibold text-gray-900 dark:text-white">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square p-0.5">
            {date && (
              <button
                type="button"
                onClick={() => handleDateSelect(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isDisabled(date)}
                className={cn(
                  "w-full h-full rounded-full text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  isSelected(date) && "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
                  !isSelected(date) && isInRange(date) && "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
                  !isSelected(date) && !isInRange(date) && "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                  isDisabled(date) && "opacity-40 cursor-not-allowed",
                  !isDisabled(date) && "cursor-pointer"
                )}
                aria-label={`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
                aria-selected={isSelected(date)}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';
export default Calendar;