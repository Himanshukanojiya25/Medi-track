// src/features/public/components/cards/HospitalCard.tsx

type HospitalCardProps = {
  name: string;
  city: string;
  departments: number;
  rating?: number;
};

export function HospitalCard({
  name,
  city,
  departments,
  rating,
}: HospitalCardProps) {
  return (
    <article className="hospital-card">
      <header className="hospital-card__header">
        <h3>{name}</h3>
        <span>{city}</span>
      </header>

      <div className="hospital-card__body">
        <p>{departments}+ departments</p>
      </div>

      <footer className="hospital-card__footer">
        {rating && <span>⭐ {rating}</span>}
        <button type="button">View Hospital</button>
      </footer>
    </article>
  );
}
