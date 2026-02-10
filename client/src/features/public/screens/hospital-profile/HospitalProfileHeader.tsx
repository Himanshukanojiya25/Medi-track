// src/features/public/screens/hospital-profile/HospitalProfileHeader.tsx

import { RatingSummary } from "../../components/ratings";

export function HospitalProfileHeader() {
  return (
    <header className="hospital-profile-header">
      <div className="hospital-profile-header__content">
        <div className="hospital-profile-header__meta">
          <h1 className="hospital-profile-header__title">
            City Care Hospital
          </h1>

          <p className="hospital-profile-header__subtitle">
            Multi-speciality Hospital • Mumbai • 24×7 Emergency
          </p>

          <RatingSummary rating={4.4} reviewsCount={1240} />

          <div className="hospital-profile-header__badges">
            <span className="badge badge--success">NABH Accredited</span>
            <span className="badge badge--info">ISO Certified</span>
            <span className="badge badge--warning">Emergency Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
