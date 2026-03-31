// src/features/public/screens/emergency/EmergencyScreen.tsx
import { useEffect } from 'react';
import { SeoShell } from "../../../../layouts/public/components/SeoShell/SeoShell";
import { EmergencyHeader } from "./EmergencyHeader";
import { EmergencyActions } from "./EmergencyActions";
import '../../../../styles/pages/website/emergency.page.css';

// Emergency Stats Component
const EmergencyStats = () => {
  const stats = [
    { number: '108', label: 'AMBULANCE', sublabel: 'Free Emergency', icon: '🚑', color: 'emergency' },
    { number: '100', label: 'POLICE', sublabel: 'Law & Order', icon: '👮', color: 'primary' },
    { number: '101', label: 'FIRE', sublabel: 'Fire Rescue', icon: '🔥', color: 'warning' },
  ];

  return (
    <div className="stats-wrapper">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-glow"></div>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sublabel">{stat.sublabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function EmergencyScreen() {
  // Smooth scroll and performance optimization
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflowY = 'scroll';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.overflowY = '';
    };
  }, []);

  const handleCallAmbulance = () => window.location.href = 'tel:108';
  const handleFindHospitals = () => window.open('/hospitals/nearby', '_self');
  const handleHelplineNumbers = () => window.open('/helpline', '_self');

  return (
    <>
      <SeoShell
        title="Emergency Medical Help 24/7 - Instant Ambulance & Hospital Finder"
        description="Immediate emergency medical assistance. Call ambulance (108), find nearest hospitals, emergency helpline numbers. Available 24/7."
        keywords="emergency, ambulance 108, hospital near me, medical emergency, helpline numbers"
        image="/images/emergency-og.jpg"
      />

      <main className="emergency-screen">
        {/* Animated Background */}
        <div className="emergency-bg">
          <div className="bg-orb orbs-1"></div>
          <div className="bg-orb orbs-2"></div>
          <div className="bg-grid"></div>
        </div>

        <div className="emergency-container">
          <EmergencyHeader />
          <EmergencyActions 
            onCallAmbulance={handleCallAmbulance}
            onFindHospitals={handleFindHospitals}
            onHelplineNumbers={handleHelplineNumbers}
          />
          <EmergencyStats />
        </div>
      </main>
    </>
  );
}