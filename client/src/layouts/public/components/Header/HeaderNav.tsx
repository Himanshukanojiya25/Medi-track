import { NavLink } from "react-router-dom";
import { Stethoscope, Building2, Brain, AlertTriangle } from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Doctors",
    to: "/doctors",
    icon: <Stethoscope size={16} aria-hidden="true" />,
    description: "Verified specialists",
  },
  {
    label: "Hospitals",
    to: "/hospitals",
    icon: <Building2 size={16} aria-hidden="true" />,
    description: "Top facilities",
  },
  {
    label: "AI Symptom",
    to: "/ai-symptom",
    icon: <Brain size={16} aria-hidden="true" />,
    description: "Smart diagnosis",
    badge: "AI",
  },
  {
    label: "Emergency",
    to: "/emergency",
    icon: <AlertTriangle size={16} aria-hidden="true" />,
    description: "Immediate help",
  },
];

export function HeaderNav() {
  return (
    <nav className="header__nav" aria-label="Primary navigation">
      <ul className="header__nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="header__nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) => `header__nav-link ${isActive ? "active" : ""}`}
            >
              <div className="header__nav-link-content">
                <div className="header__nav-link-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <div className="header__nav-link-text">
                  <span className="header__nav-link-label">{item.label}</span>
                  <span className="sr-only">{item.description}</span>
                </div>
                {item.badge && (
                  <span className="header__nav-badge" aria-hidden="true">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="header__nav-indicator" aria-hidden="true" />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}