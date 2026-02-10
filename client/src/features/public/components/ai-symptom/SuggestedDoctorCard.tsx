type Props = {
  name: string;
  speciality: string;
  experience: number;
  onBook?: () => void;
};

export function SuggestedDoctorCard({
  name,
  speciality,
  experience,
  onBook,
}: Props) {
  return (
    <article className="suggested-card">
      <header className="suggested-card__header">
        <h4>{name}</h4>
        <p>{speciality}</p>
      </header>

      <div className="suggested-card__meta">
        <small>{experience}+ years experience</small>
      </div>

      <footer className="suggested-card__actions">
        <button
          type="button"
          onClick={onBook}
        >
          Book Appointment
        </button>
      </footer>
    </article>
  );
}
