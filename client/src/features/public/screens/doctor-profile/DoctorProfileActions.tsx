// src/features/public/screens/doctor-profile/DoctorProfileActions.tsx

export function DoctorProfileActions() {
  return (
    <section className="doctor-profile-actions">
      <div className="doctor-profile-actions__container">
        <div className="doctor-profile-actions__primary">
          <button className="btn btn-primary btn-lg">
            Book Appointment
          </button>
        </div>

        <div className="doctor-profile-actions__secondary">
          <button className="btn btn-outline">
            Ask AI about symptoms
          </button>

          <button className="btn btn-ghost">
            Share Profile
          </button>
        </div>
      </div>
    </section>
  );
}
