// src/features/public/screens/hospital-profile/HospitalProfileScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { HospitalProfileHeader } from "./HospitalProfileHeader";
import { HospitalProfileActions } from "./HospitalProfileActions";
import { HospitalProfileDetails } from "./HospitalProfileDetails";

export function HospitalProfileScreen() {
  return (
    <>
      <SeoShell
        title="City Care Hospital | Multi-Speciality Hospital in Mumbai"
        description="Explore City Care Hospital profile — departments, doctors, emergency services, patient reviews, and appointment booking."
      />

      <main className="hospital-profile-page">
        <HospitalProfileHeader />
        <HospitalProfileActions />
        <HospitalProfileDetails />
      </main>
    </>
  );
}
