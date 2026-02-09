// src/features/public/screens/doctors/DoctorsScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { DoctorsFilters } from "./DoctorsFilters";
import { DoctorsList } from "./DoctorsList";

export function DoctorsScreen() {
  return (
    <>
      <SeoShell
        title="Find Doctors Near You"
        description="Browse verified doctors by speciality, location, ratings and availability."
      />

      <main className="public-doctors-page">
        <h1>Doctors</h1>

        <DoctorsFilters />
        <DoctorsList />
      </main>
    </>
  );
}
