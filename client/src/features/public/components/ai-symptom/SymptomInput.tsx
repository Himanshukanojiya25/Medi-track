import { useState, RefObject } from "react";

type Props = {
  inputRef?: RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;  // ✅ FIXED: => void
  className?: string;
};

export function SymptomInput({
  inputRef,
  value,
  onChange,
  onSubmit,
  placeholder = "Describe your symptoms…",
  disabled = false,
  onKeyDown,
  className = "",
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const isSubmitDisabled = disabled || !value.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Custom onKeyDown handler
    if (onKeyDown) {
      onKeyDown(e);
    }
    
    // Enter without Shift = Submit
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitDisabled) {
        onSubmit();
      }
    }
  };

  return (
    <div
      className={`symptom-input ${
        isFocused ? "symptom-input--focused" : ""
      } ${className}`}
      role="group"
      aria-label="AI symptom input"
    >
      <textarea
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Describe your symptoms"
        rows={2}
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