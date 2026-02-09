// src/features/public/screens/hospital-profile/HospitalProfileHeader.tsx

import { RatingSummary } from "../../components/ratings";

export function HospitalProfileHeader() {
  return (
    <section className="hospital-profile-header">
      <div>
        <h1>City Care Hospital</h1>
        <p>Multi-speciality • 24x7 Emergency</p>

        <RatingSummary rating={4.4} reviewsCount={1240} />
      </div>
    </section>
  );
}
