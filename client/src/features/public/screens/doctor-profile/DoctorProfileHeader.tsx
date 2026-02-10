// src/features/public/screens/doctor-profile/DoctorProfileHeader.tsx

import { RatingSummary } from "../../components/ratings";

export function DoctorProfileHeader() {
  return (
    <header className="doctor-profile-header">
      <div className="doctor-profile-header__container">
        {/* LEFT: Core Identity */}
        <div className="doctor-profile-header__identity">
          <h1 className="doctor-profile-header__name">
            Dr. John Doe
          </h1>

          <p className="doctor-profile-header__meta">
            Cardiologist • 12+ years experience
          </p>

          <RatingSummary rating={4.6} reviewsCount={320} />

          <p className="doctor-profile-header__location">
            📍 City Heart Hospital, Mumbai
          </p>
        </div>

        {/* RIGHT: Quick CTA */}
        <div className="doctor-profile-header__cta">
          <button className="btn btn-primary">
            Book Appointment
          </button>

          <button className="btn btn-secondary">
            Ask AI about symptoms
          </button>
        </div>
      </div>
    </header>
  );
}
