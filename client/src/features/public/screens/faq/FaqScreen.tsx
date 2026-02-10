import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { FaqList } from "./FaqList";

export function FaqScreen() {
  return (
    <>
      <SeoShell
        title="Frequently Asked Questions | MediTrack"
        description="Find answers about MediTrack, platform security, AI usage, and how our healthcare infrastructure works."
      />

      <main className="faq-page">
        {/* =====================================================
            HERO
        ===================================================== */}
        <header className="faq-hero">
          <div className="faq-hero__content">
            <span className="faq-hero__badge">
              Help Center
            </span>

            <h1>Frequently Asked Questions</h1>

            <p>
              Everything you need to know about MediTrack, our
              platform architecture, security, and AI-assisted
              healthcare services.
            </p>
          </div>
        </header>

        {/* =====================================================
            FAQ CONTENT
        ===================================================== */}
        <section className="faq-content">
          <FaqList />
        </section>
      </main>
    </>
  );
}
