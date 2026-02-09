// src/features/public/screens/hospitals/HospitalsList.tsx

import { HospitalCard } from "../../components/cards";
import { CardSkeleton } from "../../components/cards";
import { usePublicHospitals } from "../../hooks/usePublicHospitals";

export function HospitalsList() {
  const { hospitals, isLoading } = usePublicHospitals();

  if (isLoading) {
    return (
      <div className="hospitals-list">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (hospitals.length === 0) {
    return <p>No hospitals found.</p>;
  }

  return (
    <section className="hospitals-list">
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
