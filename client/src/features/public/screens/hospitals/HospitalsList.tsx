// src/features/public/screens/hospitals/HospitalsList.tsx

import { HospitalCard, CardSkeleton } from "../../components/cards";
import { usePublicHospitals } from "../../hooks/usePublicHospitals";

export function HospitalsList() {
  const { hospitals, isLoading } = usePublicHospitals();

  if (isLoading) {
    return (
      <div className="search-list">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hospitals found</h3>
        <p>Try changing filters or search a nearby location.</p>
      </div>
    );
  }

  return (
    <section className="search-list">
      {hospitals.map((hospital) => (
        <HospitalCard
          key={hospital.id}
          name={hospital.name}
          city={hospital.city}
          departments={hospital.departments?.length ?? 0}
          rating={hospital.rating}
        />
      ))}
    </section>
  );
}