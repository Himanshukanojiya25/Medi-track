export function AiSymptomIntro() {
  return (
    <section className="ai-symptom-intro">
      <h1>AI Symptom Checker</h1>

      <p>
        Describe your symptoms and our AI will help guide you to the right care.
      </p>

      <textarea
        placeholder="Describe your symptoms..."
        rows={6}
      />

      <button>Analyze Symptoms</button>
    </section>
  );
}
