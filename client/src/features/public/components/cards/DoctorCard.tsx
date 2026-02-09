// src/features/public/components/cards/DoctorCard.tsx

type DoctorCardProps = {
  name: string;
  speciality: string;
  experience: number;
  rating?: number;
  hospital?: string;
};

export function DoctorCard({
  name,
  speciality,
  experience,
  rating,
  hospital,
}: DoctorCardProps) {
  return (
    <article className="doctor-card">
      <header className="doctor-card__header">
        <h3>{name}</h3>
        <span>{speciality}</span>
      </header>

      <div className="doctor-card__body">
        <p>{experience}+ years experience</p>
        {hospital && <p>Works at {hospital}</p>}
      </div>

      <footer className="doctor-card__footer">
        {rating && <span>⭐ {rating}</span>}
        <button type="button">View Profile</button>
      </footer>
    </article>
  );
}
