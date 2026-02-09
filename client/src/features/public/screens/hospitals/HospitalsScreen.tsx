// src/features/public/screens/hospitals/HospitalsScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { HospitalsFilters } from "./HospitalsFilters";
import { HospitalsList } from "./HospitalsList";

export function HospitalsScreen() {
  return (
    <>
      <SeoShell
        title="Find Hospitals Near You"
        description="Browse verified hospitals by location, departments, ratings and emergency availability."
      />

      <main className="public-hospitals-page">
        <h1>Hospitals</h1>

        <HospitalsFilters />
        <HospitalsList />
      </main>
    </>
  );
}
