import { Users, Building2, Award, Activity } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export function HomeTrust() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  
  const stats = [
    {
      icon: <Users className="home-trust__stat-icon" size={24} />,
      value: 10000,
      suffix: "+",
      label: "Verified Patients",
      color: "#3b82f6"
    },
    {
      icon: <Award className="home-trust__stat-icon" size={24} />,
      value: 500,
      suffix: "+",
      label: "Expert Doctors",
      color: "#8b5cf6"
    },
    {
      icon: <Building2 className="home-trust__stat-icon" size={24} />,
      value: 120,
      suffix: "+",
      label: "Partner Hospitals",
      color: "#10b981"
    },
    {
      icon: <Activity className="home-trust__stat-icon" size={24} />,
      value: 50000,
      suffix: "+",
      label: "Appointments",
      color: "#f59e0b"
    }
  ];

  return (
    <section className="home-trust" ref={ref}>
      <div className="home-trust__container">
        <div className="home-trust__header">
          <span className="home-trust__badge">Trusted Healthcare Network</span>
          <h2 className="home-trust__title">
            India's Most Trusted<br />Healthcare Platform
          </h2>
        </div>
        
        <div className="home-trust__grid">
          {stats.map((stat, index) => (
            <div key={index} className="home-trust__card">
              <div 
                className="home-trust__card-icon"
                style={{ background: `${stat.color}15` }}
              >
                {stat.icon}
              </div>
              <div className="home-trust__card-content">
                <div className="home-trust__card-value">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      suffix={stat.suffix}
                      enableScrollSpy
                    />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <span className="home-trust__card-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="home-trust__testimonial">
          <div className="home-trust__testimonial-avatars">
            <img src="/assets/avatars/user1.jpg" alt="User" />
            <img src="/assets/avatars/user2.jpg" alt="User" />
            <img src="/assets/avatars/user3.jpg" alt="User" />
            <img src="/assets/avatars/user4.jpg" alt="User" />
            <span>+2.5k</span>
          </div>
          <p className="home-trust__testimonial-text">
            "MediTrack helped me find the best cardiologist in my city. 
            Booked appointment in under 2 minutes!"
          </p>
        </div>
      </div>
    </section>
  );
}