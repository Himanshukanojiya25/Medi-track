// src/features/public/screens/search/SearchFilters.tsx

import {
  FilterGroup,
  LocationFilter,
  SpecialityFilter,
  AvailabilityFilter,
  RatingFilter,
} from "../../components/filters";
import { useState } from "react";

export function SearchFilters() {
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [availability, setAvailability] = useState<"today" | "any">("any");
  const [rating, setRating] = useState(0);

  return (
    <section className="search-filters">
      <FilterGroup label="Location">
        <LocationFilter value={location} onChange={setLocation} />
      </FilterGroup>

      <FilterGroup label="Speciality">
        <SpecialityFilter
          value={speciality}
          options={[
            "Cardiology",
            "Dermatology",
            "Orthopedics",
            "Neurology",
          ]}
          onChange={setSpeciality}
        />
      </FilterGroup>

      <FilterGroup label="Availability">
        <AvailabilityFilter
          value={availability}
          onChange={setAvailability}
        />
      </FilterGroup>

      <FilterGroup label="Rating">
        <RatingFilter value={rating} onChange={setRating} />
      </FilterGroup>
    </section>
  );
}
