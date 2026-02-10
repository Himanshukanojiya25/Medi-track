type SuggestedDoctor = {
  id: string;
  name: string;
  speciality: string;
  experience: number;
};

type SuggestedHospital = {
  id: string;
  name: string;
  location: string;
};

type Props = {
  onRestart: () => void;
};

export function AiSymptomResults({ onRestart }: Props) {
  // mock data (Phase 1.4)
  const doctors: SuggestedDoctor[] = [
    {
      id: "d1",
      name: "Dr. Ananya Sharma",
      speciality: "General Physician",
      experience: 12,
    },
    {
      id: "d2",
      name: "Dr. Rahul Verma",
      speciality: "Internal Medicine",
      experience: 9,
    },
  ];

  const hospitals: SuggestedHospital[] = [
    {
      id: "h1",
      name: "City Care Hospital",
      location: "Indore",
    },
    {
      id: "h2",
      name: "LifeLine Multispeciality",
      location: "Indore",
    },
  ];

  return (
    <section className="ai-symptom-result">
      <header className="ai-symptom-result__header">
        <h2>AI Assessment Result</h2>
        <p>
          Based on the symptoms you shared, here’s what we recommend.
          This is not a medical diagnosis.
        </p>
      </header>

      <div className="ai-symptom-result__summary">
        <strong>Recommended speciality:</strong>
        <span> General Physician</span>
      </div>

      {/* Doctors */}
      <section className="ai-symptom-result__section">
        <h3>Suggested Doctors</h3>

        <div className="ai-symptom-result__list">
          {doctors.map((doc) => (
            <div key={doc.id} className="ai-symptom-card">
              <h4>{doc.name}</h4>
              <p>{doc.speciality}</p>
              <small>{doc.experience}+ years experience</small>

              <button type="button">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Hospitals */}
      <section className="ai-symptom-result__section">
        <h3>Nearby Hospitals</h3>

        <div className="ai-symptom-result__list">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="ai-symptom-card">
              <h4>{hospital.name}</h4>
              <p>{hospital.location}</p>

              <button type="button">
                View Hospital
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="ai-symptom-result__disclaimer">
        <p>
          ⚠️ This AI-generated suggestion is for informational purposes only.
          Always consult a certified medical professional.
        </p>
      </div>

      <footer className="ai-symptom-result__actions">
        <button
          type="button"
          className="secondary"
          onClick={onRestart}
        >
          Start Again
        </button>
      </footer>
    </section>
  );
}
