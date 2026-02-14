// src/features/public/components/filters/AvailabilityFilter.tsx
interface AvailabilityFilterProps {
  value: "today" | "any";
  onChange: (value: "today" | "any") => void;
}

export function AvailabilityFilter({ value, onChange }: AvailabilityFilterProps) {
  return (
    <div className="availability-filter">
      <label className="availability-filter__option">
        <input
          type="radio"
          name="availability"
          value="any"
          checked={value === "any"}
          onChange={() => onChange("any")}
        />
        <span>Any time</span>
      </label>
      
      <label className="availability-filter__option">
        <input
          type="radio"
          name="availability"
          value="today"
          checked={value === "today"}
          onChange={() => onChange("today")}
        />
        <span>Available today</span>
      </label>
    </div>
  );
}