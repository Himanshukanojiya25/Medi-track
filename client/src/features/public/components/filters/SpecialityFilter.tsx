// src/features/public/components/filters/SpecialityFilter.tsx
interface SpecialityFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function SpecialityFilter({ value, options, onChange }: SpecialityFilterProps) {
  return (
    <div className="speciality-filter">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="speciality-filter__select"
      >
        <option value="">All Specialities</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}