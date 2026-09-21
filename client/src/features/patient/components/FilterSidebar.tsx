// client/src/features/patient/components/FilterSidebar.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Slider } from '../../../components/ui/slider';
import { Checkbox } from '../../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Separator } from '../../../components/ui/separator';

// ============================================================================
// TYPES
// ============================================================================

export type FilterValue = string | number | boolean | string[] | [number, number] | null;

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'searchable' | 'date';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface FilterSidebarProps {
  sections: FilterSection[];
  values: Record<string, FilterValue>;
  onChange: (values: Record<string, FilterValue>) => void;
  onApply?: (values: Record<string, FilterValue>) => void;
  onReset?: () => void;
  showApplyButton?: boolean;
  showResetButton?: boolean;
  showActiveFilters?: boolean;
  applyButtonText?: string;
  resetButtonText?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

const isRangeValue = (value: FilterValue): value is [number, number] => {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
};

const isStringArrayValue = (value: FilterValue): value is string[] => {
  return Array.isArray(value) && value.every(v => typeof v === 'string');
};

const isStringValue = (value: FilterValue): value is string => {
  return typeof value === 'string';
};

// ============================================================================
// ACTIVE FILTERS COMPONENT
// ============================================================================

interface ActiveFiltersProps {
  sections: FilterSection[];
  values: Record<string, FilterValue>;
  onRemove: (sectionId: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  sections,
  values,
  onRemove,
  onClearAll,
}) => {
  const activeFilters = useMemo(() => {
    const active: { id: string; label: string; displayValue: string }[] = [];
    
    sections.forEach((section) => {
      const value = values[section.id];
      if (value === null || value === undefined) return;
      
      if (section.type === 'checkbox' && isStringArrayValue(value) && value.length > 0) {
        const selectedOptions = section.options?.filter(opt => value.includes(opt.value));
        if (selectedOptions?.length) {
          active.push({
            id: section.id,
            label: section.label,
            displayValue: selectedOptions.map(opt => opt.label).join(', '),
          });
        }
      } else if (section.type === 'radio' && isStringValue(value) && value) {
        const option = section.options?.find(opt => opt.value === value);
        if (option) {
          active.push({
            id: section.id,
            label: section.label,
            displayValue: option.label,
          });
        }
      } else if (section.type === 'range' && isRangeValue(value)) {
        const [minVal, maxVal] = value;
        const unit = section.unit || '';
        active.push({
          id: section.id,
          label: section.label,
          displayValue: `${minVal}${unit} - ${maxVal}${unit}`,
        });
      }
    });
    
    return active;
  }, [sections, values]);
  
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Active Filters ({activeFilters.length})
        </span>
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-auto p-0 text-xs">
          Clear all
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-1 rounded-full bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700"
          >
            {filter.label}: {filter.displayValue}
            <button
              type="button"
              onClick={() => onRemove(filter.id)}
              className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label={`Remove ${filter.label} filter`}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <Separator className="my-3" />
    </div>
  );
};

// ============================================================================
// CHECKBOX FILTER (Fixed - Using onChange instead of onCheckedChange)
// ============================================================================

interface CheckboxFilterProps {
  section: FilterSection;
  value: string[];
  onChange: (value: string[]) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ section, value, onChange }) => {
  const handleToggle = useCallback((optionValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const newValue = isChecked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);
    onChange(newValue);
  }, [value, onChange]);
  
  return (
    <div className="space-y-2">
      {section.options?.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={value.includes(option.value)}
              onChange={(e) => handleToggle(option.value, e)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
          </div>
          {option.count !== undefined && (
            <span className="text-xs text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );
};

// ============================================================================
// RADIO FILTER
// ============================================================================

interface RadioFilterProps {
  section: FilterSection;
  value: string | null;
  onChange: (value: string | null) => void;
}

const RadioFilter: React.FC<RadioFilterProps> = ({ section, value, onChange }) => {
  const handleValueChange = useCallback((newValue: string) => {
    onChange(newValue === '' ? null : newValue);
  }, [onChange]);
  
  return (
    <RadioGroup value={value || ''} onValueChange={handleValueChange}>
      <label className="flex cursor-pointer items-center justify-between">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="" id={`${section.id}-all`} />
          <span className="text-sm text-gray-700 dark:text-gray-300">All</span>
        </div>
      </label>
      {section.options?.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={`${section.id}-${option.value}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
          </div>
          {option.count !== undefined && (
            <span className="text-xs text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </RadioGroup>
  );
};

// ============================================================================
// RANGE FILTER
// ============================================================================

interface RangeFilterProps {
  section: FilterSection;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ section, value, onChange }) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleValueChange = useCallback((newValue: number[]) => {
    if (newValue.length === 2) {
      setLocalValue([newValue[0], newValue[1]]);
    }
  }, []);
  
  const handleCommit = useCallback(() => {
    onChange(localValue);
  }, [localValue, onChange]);
  
  return (
    <div className="space-y-3">
      <Slider
        min={section.min ?? 0}
        max={section.max ?? 100}
        step={section.step ?? 1}
        value={localValue}
        onValueChange={handleValueChange}
        onValueCommit={handleCommit}
      />
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{localValue[0]}{section.unit}</span>
        <span>{localValue[1]}{section.unit}</span>
      </div>
    </div>
  );
};

// ============================================================================
// SEARCHABLE FILTER (Fixed - Using onChange instead of onCheckedChange)
// ============================================================================

interface SearchableFilterProps {
  section: FilterSection;
  value: string[];
  onChange: (value: string[]) => void;
}

const SearchableFilter: React.FC<SearchableFilterProps> = ({ section, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return section.options || [];
    return (section.options || []).filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [section.options, searchTerm]);
  
  const handleToggle = useCallback((optionValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const newValue = isChecked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);
    onChange(newValue);
  }, [value, onChange]);
  
  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder={section.placeholder || `Search ${section.label.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="text-sm"
      />
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {filteredOptions.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={value.includes(option.value)}
                onChange={(e) => handleToggle(option.value, e)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </div>
            {option.count !== undefined && (
              <span className="text-xs text-gray-500">({option.count})</span>
            )}
          </label>
        ))}
        {filteredOptions.length === 0 && (
          <p className="text-center text-sm text-gray-500">No options found</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DATE FILTER
// ============================================================================

interface DateFilterProps {
  section: FilterSection;
  value: string | null;
  onChange: (value: string | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ section, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Input
        type="date"
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value || null)}
        className="text-sm"
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  sections,
  values,
  onChange,
  onApply,
  onReset,
  showApplyButton = true,
  showResetButton = true,
  showActiveFilters = true,
  applyButtonText = 'Apply Filters',
  resetButtonText = 'Reset',
  className = '',
  isOpen = true,
  onClose,
  title = 'Filters',
}) => {
  const [localValues, setLocalValues] = useState<Record<string, FilterValue>>(values);
  
  React.useEffect(() => {
    setLocalValues(values);
  }, [values]);
  
  const handleChange = useCallback((sectionId: string, newValue: FilterValue) => {
    setLocalValues((prev) => ({ ...prev, [sectionId]: newValue }));
  }, []);
  
  const handleApply = useCallback(() => {
    onChange(localValues);
    onApply?.(localValues);
  }, [localValues, onChange, onApply]);
  
  const handleReset = useCallback(() => {
    const resetValues: Record<string, FilterValue> = {};
    sections.forEach((section) => {
      switch (section.type) {
        case 'checkbox':
          resetValues[section.id] = [];
          break;
        case 'radio':
          resetValues[section.id] = null;
          break;
        case 'range':
          resetValues[section.id] = [section.min ?? 0, section.max ?? 100];
          break;
        case 'searchable':
          resetValues[section.id] = [];
          break;
        case 'date':
          resetValues[section.id] = null;
          break;
        default:
          resetValues[section.id] = null;
      }
    });
    setLocalValues(resetValues);
    onChange(resetValues);
    onReset?.();
  }, [sections, onChange, onReset]);
  
  const handleRemoveFilter = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    let resetValue: FilterValue = null;
    switch (section.type) {
      case 'checkbox':
        resetValue = [];
        break;
      case 'radio':
        resetValue = null;
        break;
      case 'range':
        resetValue = [section.min ?? 0, section.max ?? 100];
        break;
      case 'searchable':
        resetValue = [];
        break;
      case 'date':
        resetValue = null;
        break;
    }
    
    setLocalValues((prev) => ({ ...prev, [sectionId]: resetValue }));
    onChange({ ...localValues, [sectionId]: resetValue });
  }, [sections, localValues, onChange]);
  
  const handleClearAll = useCallback(() => {
    handleReset();
  }, [handleReset]);
  
  const renderFilterSection = useCallback((section: FilterSection) => {
    const value = localValues[section.id];
    
    switch (section.type) {
      case 'checkbox':
        return (
          <CheckboxFilter
            section={section}
            value={isStringArrayValue(value) ? value : []}
            onChange={(newValue) => handleChange(section.id, newValue)}
          />
        );
      
      case 'radio':
        return (
          <RadioFilter
            section={section}
            value={isStringValue(value) ? value : null}
            onChange={(newValue) => handleChange(section.id, newValue)}
          />
        );
      
      case 'range':
        return (
          <RangeFilter
            section={section}
            value={isRangeValue(value) ? value : [section.min ?? 0, section.max ?? 100]}
            onChange={(newValue) => handleChange(section.id, newValue)}
          />
        );
      
      case 'searchable':
        return (
          <SearchableFilter
            section={section}
            value={isStringArrayValue(value) ? value : []}
            onChange={(newValue) => handleChange(section.id, newValue)}
          />
        );
      
      case 'date':
        return (
          <DateFilter
            section={section}
            value={isStringValue(value) ? value : null}
            onChange={(newValue) => handleChange(section.id, newValue)}
          />
        );
      
      default:
        return null;
    }
  }, [localValues, handleChange]);
  
  const sidebarContent = (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {showActiveFilters && (
          <ActiveFilters
            sections={sections}
            values={localValues}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                {section.label}
              </Label>
              {renderFilterSection(section)}
              <Separator className="mt-3" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      {(showApplyButton || showResetButton) && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            {showApplyButton && (
              <Button onClick={handleApply} className="flex-1">
                {applyButtonText}
              </Button>
            )}
            {showResetButton && (
              <Button variant="outline" onClick={handleReset} className="flex-1">
                {resetButtonText}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  // Mobile drawer behavior
  if (!isOpen && onClose) {
    return null;
  }
  
  return sidebarContent;
};

export default FilterSidebar;