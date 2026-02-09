// src/features/public/screens/search/SearchResults.tsx

import { DoctorCard, HospitalCard, CardSkeleton } from "../../components/cards";
import { usePublicSearch } from "../../hooks/usePublicSearch";

export function SearchResults() {
  const { items, isLoading } = usePublicSearch();

  if (isLoading) {
    return (
      <div className="search-results">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <section className="search-results">
      {items.map((item) => {
        if (item.type === "doctor") {
          return (
            <DoctorCard
              key={`doctor-${item.id}`}
              name={item.name}
              speciality={item.speciality}
              experience={item.experienceYears}
              rating={item.rating}
              hospital={item.hospital?.name}
            />
          );
        }

        return (
          <HospitalCard
            key={`hospital-${item.id}`}
            name={item.name}
            city={item.city}
            departments={item.departments?.length ?? 0}
            rating={item.rating}
          />
        );
      })}
    </section>
  );
}
