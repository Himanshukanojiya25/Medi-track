import { PublicHeroSearch } from "./PublicHeroSearch";
import { Stethoscope, Building2, Brain, Shield } from "lucide-react";

interface PublicHeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  variant?: "default" | "doctors" | "hospitals" | "ai" | "emergency";
  badge?: string;
  showBadge?: boolean; // ✅ New prop to control badge visibility
}

const variantConfig = {
  default: {
    badge: "Trusted Healthcare Platform",
    icon: Shield,
  },
  doctors: {
    badge: "500+ Verified Specialists",
    icon: Stethoscope,
  },
  hospitals: {
    badge: "120+ Partner Hospitals",
    icon: Building2,
  },
  ai: {
    badge: "AI-Powered Symptom Checker",
    icon: Brain,
  },
  emergency: {
    badge: "24/7 Emergency Care",
    icon: Shield,
  },
};

export function PublicHero({
  title = "Find Trusted Doctors & Hospitals Near You",
  subtitle = "Book appointments, discover hospitals, and get AI-powered health guidance — fast and reliable.",
  showSearch = true,
  variant = "default",
  badge,
  showBadge = false, // ✅ Default false — hero clean rahega
}: PublicHeroProps) {
  const config = variantConfig[variant];
  const BadgeIcon = config.icon;

  return (
    <section className={`public-hero public-hero--${variant}`}>
      {/* Background elements */}
      <div className="public-hero__gradient" />
      <div className="public-hero__pattern" />
      <div className="public-hero__particles" />
      
      <div className="public-hero__container">
        <div className="public-hero__content">
          
          {/* ✅ Badge - only when explicitly needed */}
          {showBadge && (
            <div className="public-hero__badge">
              <BadgeIcon size={14} aria-hidden="true" />
              <span>{badge || config.badge}</span>
            </div>
          )}

          {/* Title & Subtitle */}
          <h1 className="public-hero__title">{title}</h1>
          <p className="public-hero__subtitle">{subtitle}</p>

          {/* ✅ ONLY SEARCH - No stats here */}
          {showSearch && (
            <div className="public-hero__search-wrapper">
              <PublicHeroSearch variant={variant} />
            </div>
          )}

          {/* ❌ STATS COMPLETELY REMOVED FROM HERO */}
          
        </div>
      </div>
    </section>
  );
}