// src/features/public/screens/doctor-profile/DoctorProfileActions.tsx
export function DoctorProfileActions() {
  const actions = [
    {
      icon: '📋',
      title: 'Book Appointment',
      subtitle: 'Instant confirmation',
      gradient: 'primary',
      primary: true
    },
    {
      icon: '🤖',
      title: 'Ask AI Assistant',
      subtitle: 'Check symptoms',
      gradient: 'secondary'
    },
    {
      icon: '📞',
      title: 'Call Clinic',
      subtitle: '24/7 available',
      gradient: 'outline'
    },
    {
      icon: '↗️',
      title: 'Share Profile',
      subtitle: 'Refer a friend',
      gradient: 'ghost'
    }
  ];

  return (
    <div className="profile-actions animate-slideUp">
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-btn-card ${action.gradient} ${action.primary ? 'primary' : ''}`}
          >
            <div className="btn-glow"></div>
            <span className="btn-icon">{action.icon}</span>
            <div className="btn-content">
              <span className="btn-title">{action.title}</span>
              <span className="btn-subtitle">{action.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}