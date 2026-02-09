// src/features/public/components/filters/AvailabilityFilter.tsx

type AvailabilityFilterProps = {
  value?: "today" | "any";
  onChange: (value: "today" | "any") => void;
};

export function AvailabilityFilter({
  value = "any",
  onChange,
}: AvailabilityFilterProps) {
  return (
    <div className="availability-filter">
      <label>
        <input
          type="radio"
          checked={value === "any"}
          onChange={() => onChange("any")}
        />
        Any day
      </label>

      <label>
        <input
          type="radio"
          checked={value === "today"}
          onChange={() => onChange("today")}
        />
        Available today
      </label>
    </div>
  );
}
