import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Building2, 
  Brain, 
  Phone,
  HelpCircle,
  FileText,
  ChevronRight 
} from "lucide-react"; // ✅ AlertTriangle hata diya

interface FooterLink {
  label: string;
  to: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const LINK_GROUPS: FooterGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "Doctors", to: "/doctors", icon: <Stethoscope size={14} /> },
      { label: "Hospitals", to: "/hospitals", icon: <Building2 size={14} /> },
      { label: "AI Symptom Checker", to: "/ai-symptom", icon: <Brain size={14} />, badge: "AI" },
      // ✅ EMERGENCY LINK HATAYA - AB NAHI DIKHEGA
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about", icon: <FileText size={14} /> },
      { label: "Contact", to: "/contact", icon: <Phone size={14} /> },
      { label: "FAQ", to: "/faq", icon: <HelpCircle size={14} /> }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy", icon: <FileText size={14} /> },
      { label: "Terms of Service", to: "/terms", icon: <FileText size={14} /> }
    ]
  }
];

export function FooterLinks() {
  return (
    <div className="footer__main">
      {LINK_GROUPS.map((group) => (
        <div key={group.title} className="footer__nav-group">
          <h4 className="footer__nav-title">{group.title}</h4>
          <ul className="footer__nav-list">
            {group.links.map((link) => (
              <li key={link.to} className="footer__nav-item">
                <Link to={link.to} className="footer__nav-link">
                  <span className="footer__nav-link-content">
                    {link.icon && (
                      <span className="footer__nav-link-icon" aria-hidden="true">
                        {link.icon}
                      </span>
                    )}
                    <span className="footer__nav-link-text">{link.label}</span>
                    {link.badge && (
                      <span className="footer__nav-badge">{link.badge}</span>
                    )}
                  </span>
                  <ChevronRight className="footer__nav-link-arrow" size={12} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}