// src/features/public/screens/hospital-profile/HospitalProfileDetails.tsx

export function HospitalProfileDetails() {
  return (
    <section className="hospital-profile-details">
      <h2>About Hospital</h2>
      <p>
        City Care Hospital is a leading multi-speciality healthcare center
        offering advanced treatments, experienced doctors, and modern
        infrastructure.
      </p>

      <h3>Departments</h3>
      <ul>
        <li>Cardiology</li>
        <li>Neurology</li>
        <li>Orthopedics</li>
        <li>Emergency & Trauma</li>
      </ul>

      <h3>Facilities</h3>
      <ul>
        <li>24x7 Emergency</li>
        <li>ICU & NICU</li>
        <li>Pharmacy</li>
        <li>Ambulance Service</li>
      </ul>
    </section>
  );
}
