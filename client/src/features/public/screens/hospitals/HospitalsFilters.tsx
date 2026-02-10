// src/features/public/screens/hospitals/HospitalsFilters.tsx

import {
  FilterGroup,
  LocationFilter,
  RatingFilter,
} from "../../components/filters";
import { useState } from "react";

export function HospitalsFilters() {
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <section className="filters-panel">
      <h3 className="filters-title">Filter Hospitals</h3>

      <FilterGroup
        label="Location"
      >
        <LocationFilter value={location} onChange={setLocation} />
      </FilterGroup>

      <FilterGroup
        label="Minimum Rating"
      >
        <RatingFilter value={rating} onChange={setRating} />
      </FilterGroup>
    </section>
  );
}
