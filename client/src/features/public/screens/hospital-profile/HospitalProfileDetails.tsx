// src/features/public/screens/hospital-profile/HospitalProfileDetails.tsx

export function HospitalProfileDetails() {
  return (
    <section className="hospital-profile-details">
      {/* ABOUT */}
      <article className="hospital-profile-section">
        <h2>About City Care Hospital</h2>
        <p>
          City Care Hospital is a leading multi-speciality healthcare institution
          delivering advanced medical care with state-of-the-art infrastructure,
          experienced specialists, and patient-centric services.
        </p>
      </article>

      {/* DEPARTMENTS */}
      <article className="hospital-profile-section">
        <h3>Departments & Specialities</h3>
        <ul className="hospital-profile-list">
          <li>Cardiology</li>
          <li>Neurology</li>
          <li>Orthopedics</li>
          <li>General Surgery</li>
          <li>Emergency & Trauma Care</li>
        </ul>
      </article>

      {/* FACILITIES */}
      <article className="hospital-profile-section">
        <h3>Facilities & Infrastructure</h3>
        <ul className="hospital-profile-list">
          <li>24×7 Emergency Services</li>
          <li>ICU & NICU</li>
          <li>Advanced Diagnostic Labs</li>
          <li>In-house Pharmacy</li>
          <li>Ambulance & Trauma Support</li>
        </ul>
      </article>

      {/* LOCATION */}
      <article className="hospital-profile-section">
        <h3>Location</h3>
        <p>Mumbai, Maharashtra, India</p>
      </article>
    </section>
  );
}
