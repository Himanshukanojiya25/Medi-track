// src/features/public/components/filters/SpecialityFilter.tsx

type SpecialityFilterProps = {
  value?: string;
  options: string[];
  onChange: (value: string) => void;
};

export function SpecialityFilter({
  value,
  options,
  onChange,
}: SpecialityFilterProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by speciality"
    >
      <option value="">All Specialities</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
