import { SeoShell } from "../../../../layouts/public/components/SeoShell";

export function AboutScreen() {
  return (
    <>
      <SeoShell
        title="About MediTrack | Intelligent Healthcare Infrastructure"
        description="MediTrack is an intelligent healthcare platform building secure, scalable, and AI-driven infrastructure for patients, doctors, and hospitals."
      />

      <main className="about-page">
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="about-hero">
          <div className="about-hero__content">
            <span className="about-hero__badge">
              Healthcare Infrastructure Platform
            </span>

            <h1>
              Re-imagining Healthcare for a
              <br />
              Digital-First World
            </h1>

            <p>
              MediTrack is building a modern healthcare operating system that
              connects patients, doctors, and hospitals through secure,
              scalable, and AI-assisted infrastructure.
            </p>
          </div>
        </section>

        {/* =====================================================
            PROBLEM
        ===================================================== */}
        <section className="about-section">
          <header className="about-section__header">
            <h2>The Problem We’re Solving</h2>
          </header>

          <div className="about-section__content">
            <p>
              Healthcare systems today are fragmented. Patient records are
              scattered across hospitals, workflows are manual, and
              decision-making is slow and reactive.
            </p>

            <p>
              This fragmentation leads to delayed care, operational
              inefficiencies, compliance risks, and a poor patient experience —
              especially at scale.
            </p>
          </div>
        </section>

        {/* =====================================================
            SOLUTION
        ===================================================== */}
        <section className="about-section about-section--highlight">
          <header className="about-section__header">
            <h2>Our Solution</h2>
          </header>

          <ul className="about-solution-list">
            <li>
              <strong>Unified Healthcare Data</strong>
              <span>
                A centralized, role-aware data layer connecting patients,
                doctors, and hospitals.
              </span>
            </li>

            <li>
              <strong>AI-Assisted Workflows</strong>
              <span>
                Intelligent triage, insights, and assistance embedded directly
                into clinical and operational flows.
              </span>
            </li>

            <li>
              <strong>Enterprise-Ready Dashboards</strong>
              <span>
                Purpose-built experiences for patients, doctors, hospital
                admins, and super admins.
              </span>
            </li>

            <li>
              <strong>Security & Compliance by Design</strong>
              <span>
                Audit logs, strict access control, and data isolation across
                organizations.
              </span>
            </li>
          </ul>
        </section>

        {/* =====================================================
            DIFFERENTIATORS
        ===================================================== */}
        <section className="about-section">
          <header className="about-section__header">
            <h2>Why MediTrack Is Different</h2>
          </header>

          <div className="about-grid">
            <article className="about-card">
              <h3>Built for Scale</h3>
              <p>
                Designed from day one to support millions of users, records, and
                transactions with predictable performance.
              </p>
            </article>

            <article className="about-card">
              <h3>AI-First Architecture</h3>
              <p>
                AI is not a feature — it’s a foundational layer powering
                guidance, insights, and automation.
              </p>
            </article>

            <article className="about-card">
              <h3>Healthcare-Grade Security</h3>
              <p>
                Strong RBAC, auditability, and tenant isolation aligned with
                healthcare compliance standards.
              </p>
            </article>
          </div>
        </section>

        {/* =====================================================
            TRUST & COMPLIANCE
        ===================================================== */}
        <section className="about-section about-section--trust">
          <header className="about-section__header">
            <h2>Trust, Compliance & Reliability</h2>
          </header>

          <div className="about-section__content">
            <p>
              MediTrack follows strict engineering and governance practices.
              Privacy, security, auditability, and reliability are built into
              every layer of the platform.
            </p>

            <p>
              Our architecture is designed to support compliance-driven
              healthcare environments without slowing innovation.
            </p>
          </div>
        </section>

        {/* =====================================================
            VISION
        ===================================================== */}
        <section className="about-section about-section--vision">
          <header className="about-section__header">
            <h2>Our Vision</h2>
          </header>

          <div className="about-section__content">
            <p>
              To become the most trusted digital healthcare operating system —
              enabling better outcomes for patients and smarter operations for
              providers worldwide.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
