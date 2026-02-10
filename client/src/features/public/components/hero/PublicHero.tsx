export function PublicHero() {
  return (
    <div className="home-hero__container">
      <div>
        <h1 className="home-hero__title">
          Find Trusted Doctors & Hospitals Near You
        </h1>

        <p className="home-hero__subtitle">
          Book appointments, discover hospitals, and get AI-powered health
          guidance — fast and reliable.
        </p>

        <div className="home-hero__actions">
          <input
            className="input"
            placeholder="Search doctors, hospitals"
          />

          <button className="btn btn-primary">
            Search
          </button>
        </div>

        <div className="home-hero__stats">
          <span><strong>5,000+</strong> Doctors</span>
          <span><strong>1,200+</strong> Hospitals</span>
          <span><strong>300+</strong> Cities</span>
        </div>
      </div>
    </div>
  );
}
