// src/features/public/screens/hospital-profile/HospitalProfileScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { HospitalProfileHeader } from "./HospitalProfileHeader";
import { HospitalProfileDetails } from "./HospitalProfileDetails";
import { HospitalProfileActions } from "./HospitalProfileActions";

export function HospitalProfileScreen() {
  return (
    <>
      <SeoShell
        title="Hospital Profile"
        description="View hospital details, departments, doctors, ratings and facilities."
      />

      <main className="hospital-profile-page">
        <HospitalProfileHeader />
        <HospitalProfileActions />
        <HospitalProfileDetails />
      </main>
    </>
  );
}
