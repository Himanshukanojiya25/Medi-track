interface HomeEmergencyProps {
  phoneNumber?: string;
}

export function HomeEmergency({ phoneNumber = "108" }: HomeEmergencyProps) {
  return (
    <section className="home-emergency">
      <div className="home-emergency__container">
        <h2>Medical emergency?</h2>
        <p>
          If you or someone around you needs immediate help,
          contact emergency services right now.
        </p>

        <a
          href={`tel:${phoneNumber}`}
          className="home-emergency__action"
        >
          Call {phoneNumber}
        </a>
      </div>
    </section>
  );
}
