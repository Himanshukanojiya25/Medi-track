import { useState } from "react";
import {
  FilterGroup,
  LocationFilter,
  SpecialityFilter,
  AvailabilityFilter,
  RatingFilter,
} from "../../components/filters";

export function DoctorsFilters() {
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [availability, setAvailability] =
    useState<"today" | "any">("any");
  const [rating, setRating] = useState(0);

  return (
    <section className="doctors-filters">
      <h3 style={{ marginBottom: "16px" }}>Refine results</h3>

      <FilterGroup
        label="Location"
        description="City or area"
      >
        <LocationFilter value={location} onChange={setLocation} />
      </FilterGroup>

      <FilterGroup
        label="Speciality"
        description="Type of doctor"
      >
        <SpecialityFilter
          value={speciality}
          options={[
            "Cardiology",
            "Dermatology",
            "Orthopedics",
            "Neurology",
            "Pediatrics",
          ]}
          onChange={setSpeciality}
        />
      </FilterGroup>

      <FilterGroup
        label="Availability"
        description="Appointment timing"
      >
        <AvailabilityFilter
          value={availability}
          onChange={setAvailability}
        />
      </FilterGroup>

      <FilterGroup
        label="Patient rating"
        description="Minimum rating"
      >
        <RatingFilter value={rating} onChange={setRating} />
      </FilterGroup>
    </section>
  );
}
