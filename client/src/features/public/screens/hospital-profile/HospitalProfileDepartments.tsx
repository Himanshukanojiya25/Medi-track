// src/features/public/screens/hospital-profile/HospitalProfileDepartments.tsx

const DEPARTMENTS = [
  {
    name: "Cardiology",
    description: "Advanced heart care, angiography, bypass & ICU support",
  },
  {
    name: "Neurology",
    description: "Brain, spine & nerve disorder treatments",
  },
  {
    name: "Orthopedics",
    description: "Joint replacement, sports injury & trauma care",
  },
  {
    name: "Emergency & Trauma",
    description: "24x7 emergency response with ICU & ambulance support",
  },
];

export function HospitalProfileDepartments() {
  return (
    <section
      className="hospital-profile-departments"
      aria-labelledby="hospital-departments-heading"
    >
      <h2 id="hospital-departments-heading">Departments & Specialities</h2>

      <ul className="department-list">
        {DEPARTMENTS.map((dept) => (
          <li key={dept.name} className="department-card">
            <h3 className="department-card__title">{dept.name}</h3>
            <p className="department-card__description">
              {dept.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
