// src/features/public/screens/doctor-profile/DoctorProfileDetails.tsx
export function DoctorProfileDetails() {
  return (
    <section className="profile-details animate-slideUp">
      <div className="details-card">
        <h2 className="section-title">
          <span className="title-icon">👨‍⚕️</span>
          About Dr. John Doe
        </h2>
        
        <div className="about-content">
          <p className="about-text">
            Dr. John Doe is a highly experienced cardiologist specializing in
            preventive and interventional cardiology. With over 12 years of
            clinical experience, he has helped thousands of patients manage
            complex heart conditions with compassion and precision.
          </p>
          
          <div className="achievement-stats">
            <div className="achievement-item">
              <span className="achievement-number">5,000+</span>
              <span className="achievement-label">Surgeries</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-number">15+</span>
              <span className="achievement-label">Research Papers</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-number">10+</span>
              <span className="achievement-label">Awards</span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Qualifications */}
          <div className="detail-block">
            <h3 className="block-title">
              <span className="block-icon">🎓</span>
              Qualifications
            </h3>
            <ul className="block-list">
              <li className="list-item">
                <span className="item-bullet">•</span>
                MBBS - Grant Medical College, Mumbai
              </li>
              <li className="list-item">
                <span className="item-bullet">•</span>
                MD (Cardiology) - AIIMS, Delhi
              </li>
              <li className="list-item">
                <span className="item-bullet">•</span>
                FACC – Fellow of the American College of Cardiology
              </li>
              <li className="list-item">
                <span className="item-bullet">•</span>
                Fellowship in Interventional Cardiology - Germany
              </li>
            </ul>
          </div>

          {/* Hospital */}
          <div className="detail-block">
            <h3 className="block-title">
              <span className="block-icon">🏥</span>
              Hospital Affiliation
            </h3>
            <div className="hospital-info">
              <p className="hospital-name">City Heart Hospital</p>
              <p className="hospital-address">Andheri East, Mumbai - 400069</p>
              <div className="hospital-timings">
                <span className="timing-badge">Mon - Sat</span>
                <span className="timing-badge">10:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="detail-block">
            <h3 className="block-title">
              <span className="block-icon">🗣️</span>
              Languages Spoken
            </h3>
            <div className="language-tags">
              <span className="language-tag">English</span>
              <span className="language-tag">Hindi</span>
              <span className="language-tag">Marathi</span>
              <span className="language-tag">Gujarati</span>
            </div>
          </div>

          {/* Experience */}
          <div className="detail-block">
            <h3 className="block-title">
              <span className="block-icon">💼</span>
              Experience
            </h3>
            <ul className="block-list">
              <li className="list-item">
                <span className="item-bullet">•</span>
                Sr. Consultant - City Heart Hospital (2018-Present)
              </li>
              <li className="list-item">
                <span className="item-bullet">•</span>
                Associate Consultant - Lilavati Hospital (2014-2018)
              </li>
              <li className="list-item">
                <span className="item-bullet">•</span>
                Resident - AIIMS, Delhi (2010-2014)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}