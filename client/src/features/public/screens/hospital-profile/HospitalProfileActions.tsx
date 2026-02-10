// src/features/public/screens/hospital-profile/HospitalProfileActions.tsx

export function HospitalProfileActions() {
  return (
    <section
      className="hospital-profile-actions"
      aria-label="Hospital actions"
    >
      <div className="hospital-profile-actions__primary">
        <button
          type="button"
          className="btn btn-primary"
          aria-label="Book appointment at City Care Hospital"
        >
          Book Appointment
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          aria-label="View doctors of City Care Hospital"
        >
          View Doctors
        </button>
      </div>

      <div className="hospital-profile-actions__secondary">
        <button
          type="button"
          className="btn btn-outline"
          aria-label="Get directions to City Care Hospital"
        >
          Get Directions
        </button>

        <button
          type="button"
          className="btn btn-danger"
          aria-label="Call emergency services"
        >
          Emergency Call
        </button>
      </div>
    </section>
  );
}
