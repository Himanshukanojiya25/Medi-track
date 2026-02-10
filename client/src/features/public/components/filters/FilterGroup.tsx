import { ReactNode } from "react";

interface FilterGroupProps {
  label: string;
  description?: string; // ✅ ADD THIS
  children: ReactNode;
}

export function FilterGroup({
  label,
  description,
  children,
}: FilterGroupProps) {
  return (
    <div className="filter-group">
      <div className="filter-group__header">
        <span className="filter-group__label">{label}</span>

        {description && (
          <span className="filter-group__description">
            {description}
          </span>
        )}
      </div>

      <div className="filter-group__content">{children}</div>
    </div>
  );
}
