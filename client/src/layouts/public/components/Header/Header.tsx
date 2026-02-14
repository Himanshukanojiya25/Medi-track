import { useState, useEffect } from "react";
import { HeaderNav } from "./HeaderNav";
import { HeaderActions } from "./HeaderActions";
import { Menu, X, ChevronRight } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        role="banner"
        className={`public-header ${isScrolled ? "scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <div className="public-header__container">
          {/* Brand */}
          <div className="header__brand">
            <a href="/" aria-label="MediTrack Home" className="header__brand-link">
              <div className="header__logo-wrapper">
                <span className="header__logo-main">MediTrack</span>
                <div className="header__logo-gradient" aria-hidden="true" />
              </div>
              <div className="header__tagline-container">
                <span className="header__tagline-text">SMART HEALTHCARE PLATFORM</span>
                <ChevronRight className="header__tagline-arrow" size={12} aria-hidden="true" />
              </div>
            </a>
          </div>

          <HeaderNav />
          
          <div className="header__actions-desktop">
            <HeaderActions />
          </div>

          {/* Menu Toggle Button */}
          <button
            type="button"
            className="header__mobile-toggle"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="header__mobile-icon" size={24} aria-hidden="true" />
            ) : (
              <Menu className="header__mobile-icon" size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-nav-menu"
        className={`header__mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={isMobileMenuOpen ? "false" : "true"}
      >
        <div className="header__mobile-container">
          {/* ✅ HEADER MEIN CLOSE BUTTON */}
          <div className="header__mobile-header">
            <span className="header__mobile-logo">MediTrack</span>
            <button
              type="button"
              className="header__mobile-close"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="header__mobile-brand">
            <span className="header__mobile-tagline">SMART HEALTHCARE PLATFORM</span>
          </div>

          <nav className="header__mobile-nav" aria-label="Mobile navigation">
            <ul className="header__mobile-list">
              <li className="header__mobile-item">
                <a href="/doctors" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="header__mobile-link-text">Doctors</span>
                  <ChevronRight className="header__mobile-link-arrow" size={16} aria-hidden="true" />
                </a>
              </li>
              <li className="header__mobile-item">
                <a href="/hospitals" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="header__mobile-link-text">Hospitals</span>
                  <ChevronRight className="header__mobile-link-arrow" size={16} aria-hidden="true" />
                </a>
              </li>
              <li className="header__mobile-item">
                <a href="/ai-symptom" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="header__mobile-link-badge">
                    <span className="header__mobile-link-text">AI Symptom Checker</span>
                    <span className="header__mobile-badge">AI</span>
                  </div>
                  <ChevronRight className="header__mobile-link-arrow" size={16} aria-hidden="true" />
                </a>
              </li>
              <li className="header__mobile-item">
                <a href="/emergency" className="header__mobile-link header__mobile-link--emergency" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="header__mobile-link-text">Emergency</span>
                  <ChevronRight className="header__mobile-link-arrow" size={16} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>

          <div className="header__mobile-actions">
            <a
              href="/login"
              className="header__mobile-button header__mobile-button--login"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="header__mobile-button header__mobile-button--primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started Free
            </a>
          </div>

          <div className="header__mobile-footer">
            <p className="header__mobile-disclaimer">Trusted by 10,000+ patients worldwide</p>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`header__mobile-backdrop ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={isMobileMenuOpen ? "false" : "true"}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}