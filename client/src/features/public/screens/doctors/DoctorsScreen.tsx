import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { DoctorsFilters } from "./DoctorsFilters";
import { DoctorsList } from "./DoctorsList";

export function DoctorsScreen() {
  return (
    <>
      <SeoShell
        title="Find Trusted Doctors Near You | MediTrack"
        description="Discover verified doctors by speciality, location, availability and patient ratings. Make confident healthcare decisions with MediTrack."
      />

      <main className="search-page">
        <div className="search-container">
          {/* Page Header */}
          <header style={{ marginBottom: "32px" }}>
            <h1>Doctors</h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "640px" }}>
              Browse verified doctors and specialists. Filter by location,
              speciality, availability and ratings to find the right care.
            </p>
          </header>

          {/* Filters + Results */}
          <div className="search-results">
            {/* Results */}
            <DoctorsList />

            {/* Sidebar Filters */}
            <aside className="search-sidebar">
              <DoctorsFilters />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
