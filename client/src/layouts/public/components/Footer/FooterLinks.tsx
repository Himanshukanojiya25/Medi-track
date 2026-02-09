// src/layouts/public/components/Footer/FooterLinks.tsx

const LINK_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Doctors", href: "/doctors" },
      { label: "Hospitals", href: "/hospitals" },
      { label: "AI Symptom Checker", href: "/ai-symptom" },
      { label: "Emergency", href: "/emergency" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function FooterLinks() {
  return (
    <nav className="footer__nav" aria-label="Footer navigation">
      {LINK_GROUPS.map((group) => (
        <section key={group.title} className="footer__group">
          <h4 className="footer__title">{group.title}</h4>
          <ul>
            {group.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
