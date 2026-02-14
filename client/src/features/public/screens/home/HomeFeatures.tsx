import { 
  Brain, 
  Shield, 
  Clock, 
  Users, 
  Building2, 
  HeartPulse,
  Sparkles,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: <Brain className="home-feature__icon" size={24} />,
    title: "AI Symptom Checker",
    description: "Get instant guidance on your symptoms using advanced AI. Know which specialist to consult.",
    badge: "New",
    color: "#3b82f6"
  },
  {
    icon: <Shield className="home-feature__icon" size={24} />,
    title: "Verified Doctors",
    description: "Every doctor is thoroughly verified with credentials, experience, and patient reviews.",
    badge: "Trusted",
    color: "#8b5cf6"
  },
  {
    icon: <Building2 className="home-feature__icon" size={24} />,
    title: "Top Hospitals",
    description: "Partnered with India's best hospitals. View departments, facilities, and specialist availability.",
    color: "#10b981"
  },
  {
    icon: <Clock className="home-feature__icon" size={24} />,
    title: "Instant Booking",
    description: "Book appointments instantly. No phone calls, no waiting, no hassle.",
    badge: "24/7",
    color: "#f59e0b"
  },
  {
    icon: <Users className="home-feature__icon" size={24} />,
    title: "Patient Stories",
    description: "Real experiences from patients who found the right care through MediTrack.",
    color: "#ef4444"
  },
  {
    icon: <HeartPulse className="home-feature__icon" size={24} />,
    title: "Health Records",
    description: "Secure digital locker for your medical history, prescriptions, and reports.",
    badge: "Coming Soon",
    color: "#6b7280"
  }
];

export function HomeFeatures() {
  return (
    <section className="home-features">
      <div className="home-features__container">
        <div className="home-features__header">
          <span className="home-features__badge">
            <Sparkles size={14} />
            Why Choose MediTrack
          </span>
          <h2 className="home-features__title">
            Everything you need to<br />
            find the right care
          </h2>
          <p className="home-features__subtitle">
            Discover doctors, hospitals, and AI-powered guidance — 
            all in one trusted platform.
          </p>
        </div>
        
        <div className="home-features__grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="home-feature"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="home-feature__icon-wrapper"
                style={{ background: `${feature.color}12` }}
              >
                {feature.icon}
                {feature.badge && (
                  <span className="home-feature__badge">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="home-feature__title">{feature.title}</h3>
              <p className="home-feature__description">{feature.description}</p>
              <a href="#" className="home-feature__link">
                Learn more
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}