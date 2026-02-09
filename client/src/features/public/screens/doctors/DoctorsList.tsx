// src/features/public/screens/doctors/DoctorsList.tsx

import { DoctorCard } from "../../components/cards";
import { CardSkeleton } from "../../components/cards";
import { usePublicDoctors } from "../../hooks/usePublicDoctors";

export function DoctorsList() {
  const { doctors, isLoading } = usePublicDoctors();

  if (isLoading) {
    return (
      <div className="doctors-list">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (doctors.length === 0) {
    return <p>No doctors found.</p>;
  }

  return (
    <section className="doctors-list">
      {doctors.map((doc) => (
        <DoctorCard
          key={doc.id}
          name={doc.name}
          speciality={doc.speciality}
          experience={doc.experienceYears}
          rating={doc.rating}
          hospital={doc.hospital?.name}
        />
      ))}
    </section>
  );
}
