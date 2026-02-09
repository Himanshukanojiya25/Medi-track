// src/features/public/components/filters/LocationFilter.tsx

type LocationFilterProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  return (
    <input
      type="text"
      placeholder="Enter city"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by location"
    />
  );
}
