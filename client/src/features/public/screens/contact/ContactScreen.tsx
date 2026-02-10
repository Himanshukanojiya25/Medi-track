import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { ContactForm } from "./ContactForm";

export function ContactScreen() {
  return (
    <>
      <SeoShell
        title="Contact MediTrack | Support & Enquiries"
        description="Get in touch with MediTrack for support, partnerships, or general enquiries. Our team is here to help."
      />

      <main className="contact-page">
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="contact-hero">
          <div className="contact-hero__content">
            <span className="contact-hero__badge">
              Support & Enquiries
            </span>

            <h1>Contact MediTrack</h1>

            <p>
              Have a question, feedback, or partnership enquiry?
              Our team is here to help you.
            </p>
          </div>
        </section>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <section className="contact-content">
          <div className="contact-content__grid">
            {/* LEFT: INFO */}
            <div className="contact-info">
              <h2>Get in Touch</h2>

              <p>
                Whether you’re a patient, doctor, hospital administrator,
                or partner — we’d love to hear from you.
              </p>

              <ul className="contact-info__list">
                <li>
                  <strong>Email</strong>
                  <span>support@meditrack.health</span>
                </li>

                <li>
                  <strong>Support Hours</strong>
                  <span>Monday – Friday, 9:00 AM – 6:00 PM</span>
                </li>

                <li>
                  <strong>Location</strong>
                  <span>India</span>
                </li>
              </ul>
            </div>

            {/* RIGHT: FORM */}
            <div className="contact-form-wrapper">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
