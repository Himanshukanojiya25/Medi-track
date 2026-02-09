// src/features/public/components/filters/FilterGroup.tsx

import { ReactNode } from "react";

type FilterGroupProps = {
  label: string;
  children: ReactNode;
};

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="filter-group">
      <label className="filter-group__label">{label}</label>
      <div className="filter-group__content">{children}</div>
    </div>
  );
}
