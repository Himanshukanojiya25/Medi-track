import { useState, useEffect } from "react";
import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";
import { Menu, X, ChevronRight, Stethoscope, Building2, Brain, AlertTriangle, Sparkles } from "lucide-react";

interface MobileNavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  badge: string | null;
  urgent: boolean;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { href: "/doctors", icon: <Stethoscope size={20} />, label: "Find Doctors", sub: "500+ verified specialists", badge: null, urgent: false },
  { href: "/hospitals", icon: <Building2 size={20} />, label: "Top Hospitals", sub: "Accredited facilities near you", badge: null, urgent: false },
  { href: "/ai-symptom", icon: <Brain size={20} />, label: "AI Symptom Checker", sub: "Smart diagnosis in seconds", badge: "AI", urgent: false },
  { href: "/emergency", icon: <AlertTriangle size={20} />, label: "Emergency", sub: "24/7 immediate assistance", badge: null, urgent: true },
];

function MobileNavLink({ item, onClose }: { item: MobileNavItem; onClose: () => void }) {
  const linkClass = item.urgent ? "drawer__link urgent" : "drawer__link";
  const iconClass = item.urgent ? "drawer__link-icon urgent" : "drawer__link-icon";

  return (
    <li className="drawer__list-item">
      <a href={item.href} className={linkClass} onClick={onClose}>
        <span className={iconClass} aria-hidden="true">
          {item.icon}
        </span>
        <span className="drawer__link-body">
          <span className="drawer__link-label">
            {item.label}
            {item.badge !== null && (
              <span className="drawer__badge" aria-label="AI feature">
                {item.badge}
              </span>
            )}
          </span>
          <span className="drawer__link-sub">{item.sub}</span>
        </span>
        <ChevronRight size={15} className="drawer__arrow" aria-hidden="true" />
      </a>
    </li>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleClose = () => setIsMobileMenuOpen(false);
  const handleToggle = () => setIsMobileMenuOpen((prev) => !prev);

  const drawerClass = isMobileMenuOpen ? "header__drawer open" : "header__drawer";
  const backdropClass = isMobileMenuOpen ? "header__backdrop open" : "header__backdrop";
  const headerClass = isScrolled ? "public-header scrolled" : "public-header";

  return (
    <>
      <div className="header-progress" aria-hidden="true" />

      <header role="banner" className={headerClass} aria-label="Main navigation">
        <div className="public-header__container">

          <a href="/" aria-label="MediTrack Home" className="header__brand-link">
            <div className="header__logo-mark" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="11" fill="url(#logoGrad)" />
                <path d="M18 8v20M8 18h20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="header__brand-text">
              <span className="header__brand-name">MediTrack</span>
              <span className="header__brand-tagline">Smart Healthcare</span>
            </div>
          </a>

          <HeaderNav />

          <div className="header__actions-desktop">
            <HeaderActions />
          </div>

          <button
            type="button"
            className="header__mobile-toggle"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-nav"
            onClick={handleToggle}
          >
            {isMobileMenuOpen
              ? <X size={22} aria-hidden="true" />
              : <Menu size={22} aria-hidden="true" />
            }
          </button>

        </div>
      </header>

      <div className={backdropClass} aria-hidden="true" onClick={handleClose} />

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={isMobileMenuOpen ? "false" : "true"}
        className={drawerClass}
      >
        <div className="drawer__header">
          <a href="/" className="drawer__brand" onClick={handleClose}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="11" fill="url(#logoGrad2)" />
              <path d="M18 8v20M8 18h20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span>MediTrack</span>
          </a>
          <button type="button" className="drawer__close" aria-label="Close navigation menu" onClick={handleClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer__ai-pill">
          <Sparkles size={13} aria-hidden="true" />
          <span>AI-Powered Healthcare Platform</span>
        </div>

        <nav className="drawer__nav" aria-label="Mobile navigation links">
          <ul className="drawer__list" role="list">
            {MOBILE_NAV_ITEMS.map((item) => (
              <MobileNavLink key={item.href} item={item} onClose={handleClose} />
            ))}
          </ul>
        </nav>

        <div className="drawer__ctas">
          <a href="/signup" className="drawer__cta drawer__cta--primary" onClick={handleClose}>
            <Sparkles size={15} aria-hidden="true" />
            <span>Get Started Free</span>
          </a>
          <a href="/login" className="drawer__cta drawer__cta--secondary" onClick={handleClose}>
            <span>Sign In</span>
          </a>
        </div>

        <div className="drawer__footer">
          <span className="drawer__trust-dot" aria-hidden="true" />
          <span>Trusted by 10,000+ patients worldwide</span>
        </div>

      </div>
    </>
  );
}