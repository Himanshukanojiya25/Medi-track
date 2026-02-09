import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { ContactForm } from "./ContactForm";

export function ContactScreen() {
  return (
    <>
      <SeoShell
        title="Contact Us"
        description="Reach out to our support team."
      />

      <main className="contact-page">
        <h1>Contact Us</h1>
        <ContactForm />
      </main>
    </>
  );
}
