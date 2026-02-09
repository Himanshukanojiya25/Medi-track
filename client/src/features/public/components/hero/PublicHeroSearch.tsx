// src/features/public/components/hero/PublicHeroSearch.tsx

export function PublicHeroSearch() {
  return (
    <div className="public-hero-search">
      <input
        type="text"
        placeholder="Search doctors, hospitals, or symptoms"
        aria-label="Search doctors or hospitals"
      />
      <button type="button">Search</button>
    </div>
  );
}
