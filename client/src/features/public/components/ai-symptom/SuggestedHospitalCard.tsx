type Props = {
  name: string;
  location: string;
  onView?: () => void;
};

export function SuggestedHospitalCard({
  name,
  location,
  onView,
}: Props) {
  return (
    <article className="suggested-card">
      <header className="suggested-card__header">
        <h4>{name}</h4>
        <p>{location}</p>
      </header>

      <footer className="suggested-card__actions">
        <button
          type="button"
          onClick={onView}
        >
          View Hospital
        </button>
      </footer>
    </article>
  );
}
