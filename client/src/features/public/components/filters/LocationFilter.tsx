// src/features/public/components/filters/LocationFilter.tsx
interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  return (
    <div className="location-filter">
      <input
        type="text"
        placeholder="Enter city or area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="location-filter__input"
      />
    </div>
  );
}