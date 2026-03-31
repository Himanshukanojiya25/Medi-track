// src/features/public/screens/doctor-profile/DoctorProfileHeader.tsx
import { RatingSummary } from "../../components/ratings";

export function DoctorProfileHeader() {
  return (
    <header className="profile-header animate-slideDown">
      <div className="profile-header-container">
        {/* Doctor Image */}
        <div className="doctor-image-wrapper">
          <div className="doctor-image">
            <span className="doctor-initials">👨‍⚕️</span>
          </div>
          <div className="image-badge verified">Verified</div>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info">
          <div className="info-top">
            <h1 className="doctor-name">
              Dr. John Doe
              <span className="name-badge">MBBS, MD, FACC</span>
            </h1>
            
            <div className="doctor-stats">
              <div className="stat-item">
                <span className="stat-value">12+</span>
                <span className="stat-label">Years</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">5k+</span>
                <span className="stat-label">Patients</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">98%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="info-middle">
            <p className="doctor-title">Senior Cardiologist & Interventional Specialist</p>
            
            <div className="doctor-meta">
              <span className="meta-item">
                <span className="meta-icon">🏥</span>
                City Heart Hospital, Mumbai
              </span>
              <span className="meta-item">
                <span className="meta-icon">📍</span>
                Andheri East, Mumbai
              </span>
            </div>
          </div>

          <div className="info-bottom">
            {/* ✅ Fixed: Removed size prop */}
            <RatingSummary rating={4.8} reviewsCount={324} />
            
            <div className="availability-badge">
              <span className="badge-dot pulse"></span>
              <span>Available Today</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="header-actions">
          <button className="action-btn primary">
            <span className="btn-icon">📅</span>
            <span className="btn-text">Book Appointment</span>
          </button>
          
          <button className="action-btn secondary">
            <span className="btn-icon">🤖</span>
            <span className="btn-text">Ask AI</span>
          </button>
          
          <button className="action-btn icon-only">
            <span className="btn-icon">↗️</span>
          </button>
        </div>
      </div>
    </header>
  );
}