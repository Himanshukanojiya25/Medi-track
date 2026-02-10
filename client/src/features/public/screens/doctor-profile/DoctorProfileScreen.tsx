// src/features/public/screens/doctor-profile/DoctorProfileScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { DoctorProfileHeader } from "./DoctorProfileHeader";
import { DoctorProfileActions } from "./DoctorProfileActions";
import { DoctorProfileDetails } from "./DoctorProfileDetails";

export function DoctorProfileScreen() {
  return (
    <>
      <SeoShell
        title="Dr. John Doe – Cardiologist in Mumbai | MediTrack"
        description="Consult Dr. John Doe, a top-rated cardiologist in Mumbai with 12+ years of experience. View profile, ratings, and book appointments online."
      />

      <main className="doctor-profile-page">
        <DoctorProfileHeader />
        <DoctorProfileActions />
        <DoctorProfileDetails />
      </main>
    </>
  );
}
