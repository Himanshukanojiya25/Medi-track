export function HomeHowItWorks() {
  return (
    <section className="home-how">
      <div className="home-how__container">
        <header className="home-how__header">
          <h2 className="home-how__title">How MediTrack works</h2>
          <p className="home-how__subtitle">
            Get the right care in just a few simple steps.
          </p>
        </header>

        <div className="home-how__steps">
          <div className="home-how__step">
            <span className="home-how__step-number">1</span>
            <h3>Search</h3>
            <p>
              Find doctors, hospitals, or use AI to understand
              what kind of care you need.
            </p>
          </div>

          <div className="home-how__step">
            <span className="home-how__step-number">2</span>
            <h3>Compare</h3>
            <p>
              Compare profiles, specialities, experience, and
              facilities before deciding.
            </p>
          </div>

          <div className="home-how__step">
            <span className="home-how__step-number">3</span>
            <h3>Book</h3>
            <p>
              Book appointments or get guidance instantly —
              no phone calls required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
