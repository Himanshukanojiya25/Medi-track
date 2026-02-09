// src/features/public/screens/doctor-profile/DoctorProfileHeader.tsx

import { RatingSummary } from "../../components/ratings";

export function DoctorProfileHeader() {
  return (
    <section className="doctor-profile-header">
      <div>
        <h1>Dr. John Doe</h1>
        <p>Cardiologist • 12+ years experience</p>
        <RatingSummary rating={4.6} reviewsCount={320} />
      </div>
    </section>
  );
}
