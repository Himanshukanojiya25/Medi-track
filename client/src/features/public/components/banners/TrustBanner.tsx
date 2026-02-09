// src/features/public/components/banners/TrustBanner.tsx

const TRUST_POINTS = [
  "Verified doctors & hospitals",
  "Secure appointment booking",
  "AI-assisted health guidance",
];

export function TrustBanner() {
  return (
    <section className="trust-banner">
      <ul className="trust-banner__list">
        {TRUST_POINTS.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
