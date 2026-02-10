// src/features/public/screens/speciality/SpecialityList.tsx

const SPECIALITIES = [
  {
    name: "Cardiology",
    description: "Heart & cardiovascular care",
  },
  {
    name: "Neurology",
    description: "Brain, nerves & spine",
  },
  {
    name: "Orthopedics",
    description: "Bones, joints & muscles",
  },
  {
    name: "Dermatology",
    description: "Skin, hair & nail treatments",
  },
  {
    name: "Pediatrics",
    description: "Healthcare for children",
  },
];

export function SpecialityList() {
  return (
    <section className="speciality-list">
      {SPECIALITIES.map((spec) => (
        <article
          key={spec.name}
          className="speciality-card"
        >
          <h3 className="speciality-card__title">
            {spec.name}
          </h3>

          <p className="speciality-card__description">
            {spec.description}
          </p>

          <span className="speciality-card__cta">
            View doctors →
          </span>
        </article>
      ))}
    </section>
  );
}
