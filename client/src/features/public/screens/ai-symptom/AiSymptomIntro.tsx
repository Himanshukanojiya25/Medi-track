import { useState, useEffect, useRef } from "react";
import { SymptomInput } from "../../components/ai-symptom";

type Props = {
  onSubmit: (text: string) => void;
};

export function AiSymptomIntro({ onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);  // ✅ HTMLTextAreaElement

  useEffect(() => {
    // Small delay for better UX
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="ai-symptom-intro">
      {/* Animated Background */}
      <div className="ai-symptom-intro__background">
        <div className="ai-symptom-intro__gradient"></div>
        <div className="ai-symptom-intro__pattern"></div>
      </div>

      <div className="ai-symptom-intro__content">
        <header className="ai-symptom-intro__header">
          <div className="ai-symptom-intro__badge">
            <span className="ai-symptom-intro__badge-dot"></span>
            AI-Powered • 24/7 Available
          </div>
          
          <h1 className="ai-symptom-intro__title">
            AI Symptom Checker
            <span className="ai-symptom-intro__title-glow"></span>
          </h1>
          
          <p className="ai-symptom-intro__subtitle">
            Describe your symptoms and our advanced AI will help guide you 
            to the right care. Your health journey starts here.
          </p>
        </header>

        <div className="ai-symptom-intro__features">
          <div className="ai-symptom-intro__feature">
            <div className="ai-symptom-intro__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <span>Instant Analysis</span>
          </div>
          <div className="ai-symptom-intro__feature">
            <div className="ai-symptom-intro__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c4.2 0 8 3.22 8 8.2 0 3.32-2.58 5.93-6.42 9.6L12 21.6l-1.58-1.4C6.58 14.13 4 11.52 4 8.2 4 5.22 7.8 2 12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span>Trusted Doctors</span>
          </div>
          <div className="ai-symptom-intro__feature">
            <div className="ai-symptom-intro__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
            </div>
            <span>100% Private</span>
          </div>
        </div>

        <div className="ai-symptom-intro__input-wrapper">
          <SymptomInput
            inputRef={inputRef}
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            placeholder="e.g., I have a fever and headache..."
            className="ai-symptom-intro__input"
          />
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={`ai-symptom-intro__submit-button ${
              isHovered ? "ai-symptom-intro__submit-button--hover" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Start symptom analysis"
          >
            <span>Start Analysis</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <p className="ai-symptom-intro__legal">
          This tool is for informational purposes only and not a medical diagnosis.
          Always consult with a healthcare professional.
        </p>
      </div>
    </section>
  );
}