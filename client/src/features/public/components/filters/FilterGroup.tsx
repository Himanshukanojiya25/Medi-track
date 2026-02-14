// src/features/public/components/filters/FilterGroup.tsx
interface FilterGroupProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function FilterGroup({ label, description, children }: FilterGroupProps) {
  return (
    <div className="filter-group">
      <div className="filter-group__header">
        <h4 className="filter-group__label">{label}</h4>
        {description && (
          <p className="filter-group__description">{description}</p>
        )}
      </div>
      <div className="filter-group__content">
        {children}
      </div>
    </div>
  );
}