// src/features/public/screens/emergency/EmergencyActions.tsx
import { useState } from 'react';

interface EmergencyActionsProps {
  onCallAmbulance?: () => void;
  onFindHospitals?: () => void;
  onHelplineNumbers?: () => void;
}

export function EmergencyActions({ 
  onCallAmbulance,
  onFindHospitals,
  onHelplineNumbers 
}: EmergencyActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, callback?: () => void) => {
    setLoading(action);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 600));
    callback?.();
    setLoading(null);
  };

  const actions = [
    {
      id: 'ambulance',
      title: 'Call Ambulance',
      subtitle: '108 • Free Emergency Service',
      icon: '🚑',
      gradient: 'emergency-gradient',
      stats: '2 min average response',
      onClick: onCallAmbulance
    },
    {
      id: 'hospitals',
      title: 'Find Nearby Hospitals',
      subtitle: 'Within 5km • 24/7 Open',
      icon: '🏥',
      gradient: 'primary-gradient',
      stats: '12 hospitals available',
      onClick: onFindHospitals
    },
    {
      id: 'helpline',
      title: 'Emergency Helpline',
      subtitle: 'Police • Fire • Ambulance',
      icon: '📞',
      gradient: 'warning-gradient',
      stats: 'All lines operational',
      onClick: onHelplineNumbers
    }
  ];

  return (
    <div className="actions-wrapper animate-slideUp">
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`action-card ${action.gradient} ${loading === action.id ? 'loading' : ''}`}
            onClick={() => handleAction(action.id, action.onClick)}
            disabled={!!loading}
          >
            {/* Background Effects */}
            <div className="card-glow"></div>
            <div className="card-particles"></div>
            
            {/* Icon */}
            <div className="card-icon-wrapper">
              <span className="card-icon">{action.icon}</span>
            </div>

            {/* Content */}
            <div className="card-content">
              <span className="card-title">{action.title}</span>
              <span className="card-subtitle">{action.subtitle}</span>
              <span className="card-stats">{action.stats}</span>
            </div>

            {/* Arrow Indicator */}
            <div className="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Loading Spinner */}
            {loading === action.id && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <span>Connecting...</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}