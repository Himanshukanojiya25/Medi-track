export function HomeFeatures() {
  return (
    <section className="home-features">
      <div className="home-features__container">
        <header className="home-features__header">
          <h2 className="home-features__title">
            Everything you need to find the right care
          </h2>
          <p className="home-features__subtitle">
            Discover doctors, hospitals, and AI-powered guidance —
            all in one trusted platform.
          </p>
        </header>

        <div className="home-features__grid">
          <article className="home-feature">
            <h3 className="home-feature__title">AI Symptom Checker</h3>
            <p className="home-feature__description">
              Describe your symptoms and get instant guidance on
              the right type of doctor or hospital.
            </p>
          </article>

          <article className="home-feature">
            <h3 className="home-feature__title">Verified Doctors</h3>
            <p className="home-feature__description">
              Browse trusted, verified doctors with clear profiles,
              specialities, and experience.
            </p>
          </article>

          <article className="home-feature">
            <h3 className="home-feature__title">Top Hospitals</h3>
            <p className="home-feature__description">
              Explore hospitals with departments, facilities,
              and patient-focused care.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
