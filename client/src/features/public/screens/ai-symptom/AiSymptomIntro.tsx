import { useState } from "react";
import { SymptomInput } from "../../components/ai-symptom";

type Props = {
  onSubmit: (text: string) => void;
};

export function AiSymptomIntro({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <section className="ai-symptom-intro">
      <header className="ai-symptom-intro__header">
        <h1>AI Symptom Checker</h1>
        <p>
          Describe your symptoms and our AI will help guide you to the right care.
        </p>
      </header>

      <div className="ai-symptom-intro__input">
        <SymptomInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
