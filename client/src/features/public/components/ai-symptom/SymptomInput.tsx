import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function SymptomInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe your symptoms…",
  disabled = false,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const isSubmitDisabled = disabled || !value.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitDisabled) {
      onSubmit();
    }
  };

  return (
    <div
      className={`symptom-input ${
        isFocused ? "symptom-input--focused" : ""
      }`}
      role="group"
      aria-label="AI symptom input"
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Describe your symptoms"
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
      >
        Analyze
      </button>
    </div>
  );
}
