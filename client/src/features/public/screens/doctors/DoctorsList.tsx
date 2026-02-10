import { DoctorCard, CardSkeleton } from "../../components/cards";
import { usePublicDoctors } from "../../hooks/usePublicDoctors";

export function DoctorsList() {
  const { doctors, isLoading } = usePublicDoctors();

  /* Loading State */
  if (isLoading) {
    return (
      <section className="doctors-list">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </section>
    );
  }

  /* Empty State */
  if (doctors.length === 0) {
    return (
      <section className="doctors-list">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h3>No doctors found</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Try adjusting your filters or searching in a nearby location.
          </p>
        </div>
      </section>
    );
  }

  /* Results */
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
