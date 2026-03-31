// src/features/public/screens/doctor-profile/DoctorProfileSpecialities.tsx
const SPECIALITIES = [
  { name: "Cardiology", icon: "❤️", description: "Heart conditions" },
  { name: "Interventional Cardiology", icon: "🩺", description: "Angioplasty, stents" },
  { name: "Heart Failure", icon: "💓", description: "CHF management" },
  { name: "Preventive Cardiology", icon: "📊", description: "Risk prevention" },
  { name: "Echocardiography", icon: "📡", description: "Echo specialist" },
  { name: "Hypertension", icon: "📈", description: "BP management" },
];

export function DoctorProfileSpecialities() {
  return (
    <section className="profile-specialities animate-slideUp">
      <div className="specialities-card">
        <h2 className="section-title">
          <span className="title-icon">🔬</span>
          Specializations
        </h2>

        <div className="specialities-grid">
          {SPECIALITIES.map((spec, index) => (
            <div key={index} className="speciality-item">
              <span className="speciality-icon">{spec.icon}</span>
              <div className="speciality-info">
                <span className="speciality-name">{spec.name}</span>
                <span className="speciality-desc">{spec.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}