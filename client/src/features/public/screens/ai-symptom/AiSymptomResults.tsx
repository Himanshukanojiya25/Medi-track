import { useState } from "react";

type SuggestedDoctor = {
  id: string;
  name: string;
  speciality: string;
  experience: number;
  rating: number;
  image?: string;
  availability: string;
};

type SuggestedHospital = {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  image?: string;
};

type Props = {
  onRestart: () => void;
};

export function AiSymptomResults({ onRestart }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  // Enhanced mock data
  const doctors: SuggestedDoctor[] = [
    {
      id: "d1",
      name: "Dr. Ananya Sharma",
      speciality: "General Physician",
      experience: 12,
      rating: 4.8,
      availability: "Available Today",
    },
    {
      id: "d2",
      name: "Dr. Rahul Verma",
      speciality: "Internal Medicine",
      experience: 9,
      rating: 4.6,
      availability: "Available Tomorrow",
    },
    {
      id: "d3",
      name: "Dr. Priya Patel",
      speciality: "Family Medicine",
      experience: 15,
      rating: 4.9,
      availability: "Available Today",
    },
  ];

  const hospitals: SuggestedHospital[] = [
    {
      id: "h1",
      name: "City Care Hospital",
      location: "Indore, Madhya Pradesh",
      distance: "2.3 km",
      rating: 4.5,
    },
    {
      id: "h2",
      name: "LifeLine Multispeciality",
      location: "Indore, Madhya Pradesh",
      distance: "3.8 km",
      rating: 4.7,
    },
    {
      id: "h3",
      name: "Apollo Clinic",
      location: "Indore, Madhya Pradesh",
      distance: "5.1 km",
      rating: 4.9,
    },
  ];

  const handleBookAppointment = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setTimeout(() => setSelectedDoctor(null), 2000);
  };

  const handleViewHospital = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    setTimeout(() => setSelectedHospital(null), 2000);
  };

  return (
    <section className="ai-symptom-result">
      {/* Success Banner */}
      <div className="ai-symptom-result__banner">
        <div className="ai-symptom-result__banner-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <div className="ai-symptom-result__banner-content">
          <h3>Analysis Complete</h3>
          <p>Your symptoms have been analyzed successfully</p>
        </div>
      </div>

      <header className="ai-symptom-result__header">
        <div className="ai-symptom-result__header-content">
          <h2>AI Assessment Results</h2>
          <p>
            Based on your symptoms, here are personalized recommendations.
            <span className="ai-symptom-result__disclaimer-text">
              This is not a medical diagnosis
            </span>
          </p>
        </div>
      </header>

      {/* Summary Card */}
      <div className="ai-symptom-result__summary-card">
        <div className="ai-symptom-result__summary-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm2 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/>
          </svg>
        </div>
        <div className="ai-symptom-result__summary-info">
          <span className="ai-symptom-result__summary-label">Recommended Speciality</span>
          <strong className="ai-symptom-result__summary-value">General Physician</strong>
          <span className="ai-symptom-result__summary-confidence">92% confidence match</span>
        </div>
      </div>

      {/* Doctors Section */}
      <section className="ai-symptom-result__section">
        <div className="ai-symptom-result__section-header">
          <h3>Suggested Doctors</h3>
          <span className="ai-symptom-result__section-count">{doctors.length} available</span>
        </div>

        <div className="ai-symptom-result__grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="ai-symptom-card">
              <div className="ai-symptom-card__image">
                <div className="ai-symptom-card__image-placeholder">
                  {doc.name.charAt(0)}
                </div>
              </div>
              
              <div className="ai-symptom-card__content">
                <h4 className="ai-symptom-card__name">{doc.name}</h4>
                <p className="ai-symptom-card__speciality">{doc.speciality}</p>
                
                <div className="ai-symptom-card__details">
                  <span className="ai-symptom-card__experience">
                    {doc.experience}+ years
                  </span>
                  <span className="ai-symptom-card__rating">
                    ⭐ {doc.rating}
                  </span>
                </div>
                
                <span className={`ai-symptom-card__availability ${
                  doc.availability.includes("Today") 
                    ? "ai-symptom-card__availability--today" 
                    : "ai-symptom-card__availability--tomorrow"
                }`}>
                  {doc.availability}
                </span>

                <button
                  type="button"
                  onClick={() => handleBookAppointment(doc.id)}
                  className="ai-symptom-card__button"
                  disabled={selectedDoctor === doc.id}
                >
                  {selectedDoctor === doc.id ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hospitals Section */}
      <section className="ai-symptom-result__section">
        <div className="ai-symptom-result__section-header">
          <h3>Nearby Hospitals</h3>
          <span className="ai-symptom-result__section-count">{hospitals.length} within 10km</span>
        </div>

        <div className="ai-symptom-result__grid">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="ai-symptom-card">
              <div className="ai-symptom-card__image">
                <div className="ai-symptom-card__image-placeholder">
                  🏥
                </div>
              </div>
              
              <div className="ai-symptom-card__content">
                <h4 className="ai-symptom-card__name">{hospital.name}</h4>
                <p className="ai-symptom-card__location">{hospital.location}</p>
                
                <div className="ai-symptom-card__details">
                  <span className="ai-symptom-card__distance">
                    📍 {hospital.distance}
                  </span>
                  <span className="ai-symptom-card__rating">
                    ⭐ {hospital.rating}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleViewHospital(hospital.id)}
                  className="ai-symptom-card__button ai-symptom-card__button--secondary"
                  disabled={selectedHospital === hospital.id}
                >
                  {selectedHospital === hospital.id ? "Loading..." : "View Hospital Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="ai-symptom-result__disclaimer">
        <div className="ai-symptom-result__disclaimer-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
        </div>
        <p>
          <strong>AI-Generated Suggestion</strong> — This information is for educational purposes only. 
          Always consult with a qualified healthcare provider for medical advice, diagnosis, or treatment.
        </p>
      </div>

      <footer className="ai-symptom-result__actions">
        <button
          type="button"
          onClick={onRestart}
          className="ai-symptom-result__restart-button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
          </svg>
          <span>Start New Assessment</span>
        </button>
      </footer>
    </section>
  );
}