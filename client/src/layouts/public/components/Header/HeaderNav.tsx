import { NavLink } from "react-router-dom";
import { Stethoscope, Building2, Brain, AlertTriangle } from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  urgent?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Doctors",
    to: "/doctors",
    icon: <Stethoscope size={15} aria-hidden="true" />,
    description: "500+ verified specialists",
  },
  {
    label: "Hospitals",
    to: "/hospitals",
    icon: <Building2 size={15} aria-hidden="true" />,
    description: "Top accredited facilities",
  },
  {
    label: "AI Symptom",
    to: "/ai-symptom",
    icon: <Brain size={15} aria-hidden="true" />,
    description: "Smart diagnosis instantly",
    badge: "AI",
  },
  {
    label: "Emergency",
    to: "/emergency",
    icon: <AlertTriangle size={15} aria-hidden="true" />,
    description: "24/7 immediate care",
    urgent: true,
  },
];

export function HeaderNav() {
  return (
    <nav className="header__nav" aria-label="Primary navigation">
      <ul className="header__nav-list" role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="header__nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `header__nav-link${isActive ? " active" : ""}${item.urgent ? " urgent" : ""}`
              }
            >
              <span className="header__nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="header__nav-label">{item.label}</span>
              {item.badge && (
                <span className="header__nav-badge" aria-label="AI feature">
                  {item.badge}
                </span>
              )}
              <span className="header__nav-indicator" aria-hidden="true" />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}