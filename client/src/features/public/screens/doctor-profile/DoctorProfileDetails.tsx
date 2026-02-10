// src/features/public/screens/doctor-profile/DoctorProfileDetails.tsx

export function DoctorProfileDetails() {
  return (
    <section className="doctor-profile-details">
      <div className="doctor-profile-details__container">
        {/* ABOUT */}
        <article className="doctor-profile-section">
          <h2>About Dr. John Doe</h2>
          <p>
            Dr. John Doe is a highly experienced cardiologist specializing in
            preventive and interventional cardiology. With over 12 years of
            clinical experience, he has helped thousands of patients manage
            complex heart conditions with compassion and precision.
          </p>
        </article>

        {/* QUALIFICATIONS */}
        <article className="doctor-profile-section">
          <h3>Qualifications</h3>
          <ul className="doctor-profile-list">
            <li>MBBS</li>
            <li>MD (Cardiology)</li>
            <li>FACC – Fellow of the American College of Cardiology</li>
          </ul>
        </article>

        {/* HOSPITAL */}
        <article className="doctor-profile-section">
          <h3>Hospital Affiliation</h3>
          <p>City Heart Hospital, Mumbai</p>
        </article>

        {/* LANGUAGES */}
        <article className="doctor-profile-section">
          <h3>Languages Spoken</h3>
          <ul className="doctor-profile-tags">
            <li>English</li>
            <li>Hindi</li>
            <li>Marathi</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
