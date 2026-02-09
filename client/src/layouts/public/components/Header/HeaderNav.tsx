// src/layouts/public/components/Header/HeaderNav.tsx

const NAV_ITEMS = [
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "AI Symptom", href: "/ai-symptom" },
  { label: "Emergency", href: "/emergency" },
];

export function HeaderNav() {
  return (
    <nav className="header__nav" aria-label="Primary navigation">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
