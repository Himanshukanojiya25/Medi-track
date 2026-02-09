// src/features/public/components/hero/PublicHero.tsx

import { PublicHeroSearch } from "./PublicHeroSearch";
import { PublicHeroStats } from "./PublicHeroStats";

export function PublicHero() {
  return (
    <section className="public-hero">
      <div className="public-hero__content">
        <h1 className="public-hero__title">
          Find Trusted Doctors & Hospitals Near You
        </h1>

        <p className="public-hero__subtitle">
          Book appointments, discover hospitals, and get AI-powered health
          guidance — fast and reliable.
        </p>

        <PublicHeroSearch />
        <PublicHeroStats />
      </div>
    </section>
  );
}
