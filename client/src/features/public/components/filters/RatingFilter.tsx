// src/features/public/components/filters/RatingFilter.tsx

type RatingFilterProps = {
  value?: number;
  onChange: (value: number) => void;
};

export function RatingFilter({ value = 0, onChange }: RatingFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Filter by rating"
    >
      <option value={0}>All Ratings</option>
      <option value={3}>3★ & above</option>
      <option value={4}>4★ & above</option>
      <option value={5}>5★</option>
    </select>
  );
}
