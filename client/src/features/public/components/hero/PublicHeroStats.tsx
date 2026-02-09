// src/features/public/components/hero/PublicHeroStats.tsx

const STATS = [
  { label: "Doctors", value: "5,000+" },
  { label: "Hospitals", value: "1,200+" },
  { label: "Cities", value: "300+" },
];

export function PublicHeroStats() {
  return (
    <ul className="public-hero-stats">
      {STATS.map((stat) => (
        <li key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
