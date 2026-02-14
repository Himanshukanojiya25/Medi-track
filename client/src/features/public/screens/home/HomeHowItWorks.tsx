import { Search, CheckCircle, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: <Search className="home-how__step-icon" size={32} />,
    number: "01",
    title: "Search",
    description: "Find doctors, hospitals, or use our AI symptom checker to understand what care you need.",
    features: ["50+ specialities", "Location based", "24/7 availability"]
  },
  {
    icon: <CheckCircle className="home-how__step-icon" size={32} />,
    number: "02",
    title: "Compare",
    description: "Compare profiles, experience, qualifications, and patient reviews before deciding.",
    features: ["Verified reviews", "Credentials check", "Fee transparency"]
  },
  {
    icon: <CalendarCheck className="home-how__step-icon" size={32} />,
    number: "03",
    title: "Book",
    description: "Book appointments instantly or get AI guidance — no phone calls, no waiting.",
    features: ["Instant confirmation", "Free cancellation", "Digital records"]
  }
];

export function HomeHowItWorks() {
  return (
    <section className="home-how">
      <div className="home-how__container">
        <div className="home-how__header">
          <span className="home-how__badge">Simple Process</span>
          <h2 className="home-how__title">
            Get the right care in<br />
            three simple steps
          </h2>
          <p className="home-how__subtitle">
            No complexity. No confusion. Just clear, actionable healthcare.
          </p>
        </div>
        
        <div className="home-how__steps">
          {steps.map((step, index) => (
            <div key={index} className="home-how__step">
              <div className="home-how__step-header">
                <div className="home-how__step-icon-wrapper">
                  {step.icon}
                </div>
                <span className="home-how__step-number">{step.number}</span>
              </div>
              <h3 className="home-how__step-title">{step.title}</h3>
              <p className="home-how__step-description">{step.description}</p>
              <ul className="home-how__step-features">
                {step.features.map((feature, i) => (
                  <li key={i}>
                    <CheckCircle size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="home-how__cta">
          <a href="/search" className="home-how__button">
            Start your healthcare journey
            <Search size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}