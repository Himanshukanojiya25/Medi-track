// src/features/public/screens/hospital-profile/HospitalProfileDoctors.tsx

import { DoctorCard } from "../../components/cards";

const FEATURED_DOCTORS = [
  {
    id: "1",
    name: "Dr. Amit Verma",
    speciality: "Cardiologist",
    experienceYears: 14,
    rating: 4.7,
  },
  {
    id: "2",
    name: "Dr. Neha Sharma",
    speciality: "Neurologist",
    experienceYears: 11,
    rating: 4.5,
  },
];

export function HospitalProfileDoctors() {
  return (
    <section
      className="hospital-profile-doctors"
      aria-labelledby="hospital-doctors-heading"
    >
      <h2 id="hospital-doctors-heading">Doctors at this Hospital</h2>

      <div className="hospital-doctors-list">
        {FEATURED_DOCTORS.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            speciality={doctor.speciality}
            experience={doctor.experienceYears}
            rating={doctor.rating}
          />
        ))}
      </div>
    </section>
  );
}
