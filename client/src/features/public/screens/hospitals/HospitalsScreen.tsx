// src/features/public/screens/hospitals/HospitalsScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { HospitalsFilters } from "./HospitalsFilters";
import { HospitalsList } from "./HospitalsList";

export function HospitalsScreen() {
  return (
    <>
      <SeoShell
        title="Find Hospitals Near You | MediTrack"
        description="Browse verified hospitals by location, departments, ratings and emergency availability."
      />

      <main className="search-page public-hospitals-page">
        <header className="search-header">
          <h1 className="search-title">Hospitals</h1>
          <p className="search-subtitle">
            Discover trusted hospitals with verified departments & ratings
          </p>
        </header>

        <div className="search-results">
          {/* LEFT: LIST */}
          <div className="search-list">
            <HospitalsList />
          </div>

          {/* RIGHT: FILTERS */}
          <aside className="search-sidebar">
            <HospitalsFilters />
          </aside>
        </div>
      </main>
    </>
  );
}
