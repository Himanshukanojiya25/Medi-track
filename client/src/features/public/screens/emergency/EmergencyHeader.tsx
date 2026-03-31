// src/features/public/screens/emergency/EmergencyHeader.tsx
export function EmergencyHeader() {
  return (
    <div className="header-wrapper animate-slideDown">
      <div className="header-container">
        {/* Live Status Badge */}
        <div className="status-badge">
          <span className="status-dot pulse"></span>
          <span className="status-text">24/7 EMERGENCY ACTIVE</span>
          <span className="status-chip">LIVE</span>
        </div>

        {/* Main Title */}
        <h1 className="main-title">
          Emergency
          <span className="title-gradient">Medical Help</span>
        </h1>

        {/* Description with Highlight */}
        <p className="main-description">
          <span className="description-highlight">Immediate assistance available 24/7</span>
          <br />
          One tap connects you to emergency services, nearby hospitals, 
          and critical helpline numbers.
        </p>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span>10,000+ Lives Saved</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <span>Under 30 Sec Response</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🏥</span>
            <span>500+ Network Hospitals</span>
          </div>
        </div>
      </div>
    </div>
  );
}