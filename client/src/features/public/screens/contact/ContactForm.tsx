import { useState, useRef, FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setFormStatus("submitting");

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success state after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const isFieldValid = (fieldId: string) => {
    if (fieldId === "email") {
      return formData.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    }
    return formData[fieldId as keyof typeof formData]?.length >= 2;
  };

  return (
    <form 
      ref={formRef}
      className="contact-form" 
      noValidate 
      onSubmit={handleSubmit}
    >
      {/* Form Header with Status */}
      <div className="contact-form__header">
        <h3 className="contact-form__title">Send us a Message</h3>
        {formStatus === "success" && (
          <div className="contact-form__status contact-form__status--success" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
            <span>Message sent successfully! We'll respond within 24 hours.</span>
          </div>
        )}
        {formStatus === "error" && (
          <div className="contact-form__status contact-form__status--error" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <span>Something went wrong. Please try again.</span>
          </div>
        )}
      </div>

      {/* Name Field */}
      <div className={`contact-form__field ${focusedField === "name" ? "contact-form__field--focused" : ""} ${formData.name && !isFieldValid("name") ? "contact-form__field--error" : ""}`}>
        <label htmlFor="name" className="contact-form__label">
          Full Name
          <span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__input-wrapper">
          <svg className="contact-form__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your full name"
            required
            disabled={formStatus === "submitting"}
            className="contact-form__input"
          />
          {formData.name && isFieldValid("name") && (
            <svg className="contact-form__valid-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#10b981"/>
            </svg>
          )}
        </div>
        {formData.name && !isFieldValid("name") && (
          <span className="contact-form__error-message">Name must be at least 2 characters</span>
        )}
      </div>

      {/* Email Field */}
      <div className={`contact-form__field ${focusedField === "email" ? "contact-form__field--focused" : ""} ${formData.email && !isFieldValid("email") ? "contact-form__field--error" : ""}`}>
        <label htmlFor="email" className="contact-form__label">
          Email Address
          <span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__input-wrapper">
          <svg className="contact-form__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
          </svg>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            placeholder="you@example.com"
            required
            disabled={formStatus === "submitting"}
            className="contact-form__input"
          />
          {formData.email && isFieldValid("email") && (
            <svg className="contact-form__valid-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#10b981"/>
            </svg>
          )}
        </div>
        {formData.email && !isFieldValid("email") && (
          <span className="contact-form__error-message">Please enter a valid email address</span>
        )}
      </div>

      {/* Message Field */}
      <div className={`contact-form__field ${focusedField === "message" ? "contact-form__field--focused" : ""} ${formData.message && !isFieldValid("message") ? "contact-form__field--error" : ""}`}>
        <label htmlFor="message" className="contact-form__label">
          Message
          <span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__input-wrapper">
          <svg className="contact-form__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/>
          </svg>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            placeholder="Tell us how we can help you…"
            rows={5}
            required
            disabled={formStatus === "submitting"}
            className="contact-form__textarea"
          />
          {formData.message && isFieldValid("message") && (
            <svg className="contact-form__valid-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#10b981"/>
            </svg>
          )}
        </div>
        <div className="contact-form__character-count">
          {formData.message.length}/500 characters
        </div>
      </div>

      {/* Form Actions */}
      <div className="contact-form__actions">
        <button 
          type="submit" 
          className="contact-form__submit"
          disabled={
            formStatus === "submitting" || 
            !formData.name.trim() || 
            !formData.email.trim() || 
            !formData.message.trim() ||
            !isFieldValid("email")
          }
        >
          {formStatus === "submitting" ? (
            <>
              <span className="contact-form__spinner"></span>
              Sending Message...
            </>
          ) : (
            <>
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </>
          )}
        </button>

        <p className="contact-form__note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
          </svg>
          Our team typically responds within <strong>24 hours</strong>
        </p>
      </div>

      {/* Trust Badge */}
      <div className="contact-form__trust">
        <div className="contact-form__trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/>
          </svg>
          <span>Encrypted & Secure</span>
        </div>
        <div className="contact-form__trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          <span>No spam, ever</span>
        </div>
      </div>
    </form>
  );
}