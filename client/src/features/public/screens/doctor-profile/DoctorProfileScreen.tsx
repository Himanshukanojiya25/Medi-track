// src/features/public/screens/doctor-profile/DoctorProfileScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { DoctorProfileHeader } from "./DoctorProfileHeader";
import { DoctorProfileDetails } from "./DoctorProfileDetails";
import { DoctorProfileActions } from "./DoctorProfileActions";

export function DoctorProfileScreen() {
  return (
    <>
      <SeoShell
        title="Doctor Profile"
        description="View doctor details, experience, ratings and hospital affiliation."
      />

      <main className="doctor-profile-page">
        <DoctorProfileHeader />
        <DoctorProfileActions />
        <DoctorProfileDetails />
      </main>
    </>
  );
}
