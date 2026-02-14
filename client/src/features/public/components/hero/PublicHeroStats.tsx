import { Users, Building2, MapPin, Award, Activity, Heart, Brain, Clock } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// ✅ Yeh component SIRF neeche wale stats section ke liye
// Hero me isko use MAT KARO

interface StatItem {
  icon: any;
  value: string;
  suffix: string;
  label: string;
  color: string;
}

interface PublicHeroStatsProps {
  variant?: "default" | "doctors" | "hospitals" | "ai" | "emergency";
  showIcons?: boolean;
}

const variantStats = {
  default: [
    { icon: Users, value: "10000", suffix: "+", label: "Verified Patients", color: "#3b82f6" },
    { icon: Award, value: "500", suffix: "+", label: "Expert Doctors", color: "#8b5cf6" },
    { icon: Building2, value: "120", suffix: "+", label: "Partner Hospitals", color: "#10b981" },
    { icon: MapPin, value: "300", suffix: "+", label: "Cities", color: "#f59e0b" },
  ],
  doctors: [
    { icon: Award, value: "500", suffix: "+", label: "Verified Doctors", color: "#8b5cf6" },
    { icon: Activity, value: "30", suffix: "+", label: "Specialities", color: "#3b82f6" },
    { icon: Heart, value: "50", suffix: "k+", label: "Appointments", color: "#ec4899" },
  ],
  hospitals: [
    { icon: Building2, value: "120", suffix: "+", label: "Partner Hospitals", color: "#10b981" },
    { icon: MapPin, value: "300", suffix: "+", label: "Cities", color: "#f59e0b" },
    { icon: Users, value: "10", suffix: "k+", label: "Daily Patients", color: "#3b82f6" },
  ],
  ai: [
    { icon: Brain, value: "1", suffix: "M+", label: "Symptoms Analyzed", color: "#8b5cf6" },
    { icon: Activity, value: "95", suffix: "%", label: "Accuracy", color: "#10b981" },
    { icon: Clock, value: "24/7", suffix: "", label: "Availability", color: "#3b82f6" },
  ],
  emergency: [
    { icon: Clock, value: "24/7", suffix: "", label: "Emergency Support", color: "#ef4444" },
    { icon: Activity, value: "15", suffix: "min", label: "Avg Response", color: "#f97316" },
    { icon: Heart, value: "108", suffix: "", label: "Ambulance", color: "#dc2626" },
  ],
};

export function PublicHeroStats({ 
  variant = "default",
  showIcons = true 
}: PublicHeroStatsProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  
  const stats = variantStats[variant as keyof typeof variantStats] || variantStats.default;

  return (
    <div className={`public-hero-stats public-hero-stats--${variant}`} ref={ref}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="public-hero-stats__item">
            {showIcons && (
              <div 
                className="public-hero-stats__icon-wrapper"
                style={{ background: `${stat.color}12` }}
              >
                <Icon size={20} style={{ color: stat.color }} />
              </div>
            )}
            <div className="public-hero-stats__content">
              <div className="public-hero-stats__value">
                {inView ? (
                  <CountUp
                    end={parseInt(stat.value.replace(/\D/g, '')) || 0}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <span className="public-hero-stats__label">{stat.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}