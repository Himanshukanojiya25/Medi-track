// src/features/public/screens/doctor-profile/DoctorProfileSpecialities.tsx

const SPECIALITIES = [
  "Cardiology",
  "Interventional Cardiology",
  "Heart Failure",
  "Preventive Cardiology",
];

export function DoctorProfileSpecialities() {
  return (
    <section className="doctor-profile-specialities">
      <div className="doctor-profile-specialities__container">
        <h3>Specialities</h3>

        <ul className="doctor-profile-specialities__list">
          {SPECIALITIES.map((spec) => (
            <li key={spec} className="doctor-profile-speciality-chip">
              {spec}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
