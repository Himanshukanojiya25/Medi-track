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
    <section className="hospitals-filters">
      <FilterGroup label="Location">
        <LocationFilter value={location} onChange={setLocation} />
      </FilterGroup>

      <FilterGroup label="Rating">
        <RatingFilter value={rating} onChange={setRating} />
      </FilterGroup>
    </section>
  );
}
