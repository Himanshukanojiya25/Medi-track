// src/layouts/public/PublicLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer, SeoShell } from "./components";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function PublicLayout() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);

  // Show scroll to top button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Determine if current page is emergency
  const isEmergency = location.pathname.includes("/emergency");

  return (
    <SeoShell>
      <div className={`public-layout ${isEmergency ? "public-layout--emergency" : ""}`}>
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <Header />

        <main
          role="main"
          className="public-layout__content"
          id="main-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>

        <Footer />

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            type="button"
            className="scroll-top-button"
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            title="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        )}

        {/* Emergency notification banner - if not on emergency page */}
        {!isEmergency && (
          <div className="emergency-banner" role="complementary" aria-label="Emergency notification">
            <div className="emergency-banner__content">
              <span className="emergency-banner__icon">🚨</span>
              <span className="emergency-banner__text">
                Medical emergency? Call{" "}
                <a href="tel:108" className="emergency-banner__link">
                  108
                </a>{" "}
                immediately
              </span>
            </div>
          </div>
        )}
      </div>
    </SeoShell>
  );
}