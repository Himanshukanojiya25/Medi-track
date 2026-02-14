import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { ContactForm } from "./ContactForm";

export function ContactScreen() {
  return (
    <>
      <SeoShell
        title="Contact MediTrack | Get Support & Share Feedback"
        description="Reach out to MediTrack for support, partnerships, or general enquiries. Our healthcare experts are here to assist you within 24 hours."
        keywords="contact mediTrack, healthcare support, medical platform help, telemedicine support"
      />

      <main className="contact-page">
        {/* Hero Section - Premium Gradient */}
        <section className="contact-hero">
          <div className="contact-hero__background">
            <div className="contact-hero__gradient"></div>
            <div className="contact-hero__pattern"></div>
          </div>

          <div className="contact-hero__content">
            <div className="contact-hero__badge-wrapper">
              <span className="contact-hero__badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/>
                </svg>
                Support & Enquiries
              </span>
            </div>

            <h1 className="contact-hero__title">
              Get in Touch
              <span className="contact-hero__title-glow"></span>
            </h1>

            <p className="contact-hero__subtitle">
              Have a question, feedback, or partnership enquiry? 
              Our team of healthcare experts is here to help you within 24 hours.
            </p>

            {/* Quick Stats */}
            <div className="contact-hero__stats">
              <div className="contact-hero__stat">
                <span className="contact-hero__stat-value">24h</span>
                <span className="contact-hero__stat-label">Avg Response</span>
              </div>
              <div className="contact-hero__stat">
                <span className="contact-hero__stat-value">98%</span>
                <span className="contact-hero__stat-label">Satisfaction</span>
              </div>
              <div className="contact-hero__stat">
                <span className="contact-hero__stat-value">1000+</span>
                <span className="contact-hero__stat-label">Happy Clients</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="contact-hero__decoration">
            <div className="contact-hero__circle contact-hero__circle--1"></div>
            <div className="contact-hero__circle contact-hero__circle--2"></div>
            <div className="contact-hero__circle contact-hero__circle--3"></div>
          </div>
        </section>

        {/* Content Section */}
        <section className="contact-content">
          <div className="contact-content__container">
            <div className="contact-content__grid">
              {/* LEFT: Contact Information */}
              <div className="contact-info">
                <div className="contact-info__header">
                  <span className="contact-info__badge">Contact Information</span>
                  <h2 className="contact-info__title">Let's Connect</h2>
                  <p className="contact-info__description">
                    Whether you're a patient, doctor, hospital administrator, 
                    or potential partner — we'd love to hear from you and help 
                    transform healthcare together.
                  </p>
                </div>

                {/* Contact Details Cards */}
                <ul className="contact-info__list">
                  <li className="contact-info__item">
                    <div className="contact-info__item-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="contact-info__item-content">
                      <strong>Email</strong>
                      <span>support@meditrack.health</span>
                      <small>We respond within 24 hours</small>
                    </div>
                  </li>

                  <li className="contact-info__item">
                    <div className="contact-info__item-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="contact-info__item-content">
                      <strong>Support Hours</strong>
                      <span>Monday – Friday</span>
                      <span>9:00 AM – 6:00 PM (IST)</span>
                    </div>
                  </li>

                  <li className="contact-info__item">
                    <div className="contact-info__item-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="contact-info__item-content">
                      <strong>Location</strong>
                      <span>India</span>
                      <small>Serving patients nationwide</small>
                    </div>
                  </li>
                </ul>

                {/* Trust Signals */}
                <div className="contact-info__trust">
                  <div className="contact-info__trust-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/>
                    </svg>
                    <span>Enterprise Security</span>
                  </div>
                  <div className="contact-info__trust-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                    <span>ISO 27001 Certified</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="contact-info__social">
                  <h4>Follow Us</h4>
                  <div className="contact-info__social-links">
                    <a href="#" className="contact-info__social-link" aria-label="LinkedIn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.68-1.68-1.68a1.68 1.68 0 0 0-1.68 1.68c0 .93.76 1.68 1.68 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" fill="currentColor"/>
                      </svg>
                    </a>
                    <a href="#" className="contact-info__social-link" aria-label="Twitter">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" fill="currentColor"/>
                      </svg>
                    </a>
                    <a href="#" className="contact-info__social-link" aria-label="GitHub">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT: Contact Form */}
              <div className="contact-form-wrapper">
                <div className="contact-form-wrapper__header">
                  <h3 className="contact-form-wrapper__title">Send us a Message</h3>
                  <p className="contact-form-wrapper__subtitle">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Optional but Premium */}
        <section className="contact-faq">
          <div className="contact-faq__container">
            <div className="contact-faq__header">
              <span className="contact-faq__badge">Quick Answers</span>
              <h2 className="contact-faq__title">Frequently Asked Questions</h2>
              <p className="contact-faq__subtitle">Find instant answers to common questions</p>
            </div>

            <div className="contact-faq__grid">
              <div className="contact-faq__item">
                <h4>How quickly will I get a response?</h4>
                <p>Our team typically responds within 24 hours during business days.</p>
              </div>
              <div className="contact-faq__item">
                <h4>Do you offer emergency support?</h4>
                <p>For medical emergencies, please contact local emergency services immediately.</p>
              </div>
              <div className="contact-faq__item">
                <h4>Is my information secure?</h4>
                <p>Yes, all communications are encrypted and we follow HIPAA guidelines.</p>
              </div>
              <div className="contact-faq__item">
                <h4>Can I partner with MediTrack?</h4>
                <p>Absolutely! We're always looking for healthcare partners. Send us your enquiry.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}