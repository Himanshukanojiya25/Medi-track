import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { Shield, Sparkles, Building2, Users, Brain, Lock, Heart, Target, ArrowRight } from "lucide-react";

export function AboutScreen() {
  return (
    <>
     <SeoShell
        title="About MediTrack | Intelligent Healthcare Infrastructure"
        description="MediTrack is an intelligent healthcare platform building secure, scalable, and AI-driven infrastructure for patients, doctors, and hospitals."
        keywords="healthcare platform, AI healthcare, hospital management, patient portal, digital health"
        image="/assets/og/about.jpg"  // ✅ FIXED: ogImage → image
      />

      <main className="about-page">
        {/* =====================================================
            🎯 HERO SECTION - GLASS MORPHISM
        ===================================================== */}
        <section className="about-hero">
          <div className="about-hero__gradient" />
          <div className="about-hero__pattern" />
          
          <div className="about-hero__container">
            <div className="about-hero__content">
              <div className="about-hero__badge-wrapper">
                <span className="about-hero__badge">
                  <Building2 size={14} className="about-hero__badge-icon" />
                  Healthcare Infrastructure Platform
                </span>
              </div>

              <h1 className="about-hero__title">
                Re-imagining Healthcare for a
                <br />
                <span className="about-hero__title-highlight">Digital-First World</span>
              </h1>

              <p className="about-hero__description">
                MediTrack is building a modern healthcare operating system that
                connects patients, doctors, and hospitals through secure,
                scalable, and AI-assisted infrastructure.
              </p>

              <div className="about-hero__stats">
                <div className="about-hero__stat">
                  <span className="about-hero__stat-number">10K+</span>
                  <span className="about-hero__stat-label">Active Patients</span>
                </div>
                <div className="about-hero__stat">
                  <span className="about-hero__stat-number">500+</span>
                  <span className="about-hero__stat-label">Verified Doctors</span>
                </div>
                <div className="about-hero__stat">
                  <span className="about-hero__stat-number">50+</span>
                  <span className="about-hero__stat-label">Partner Hospitals</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-hero__scroll-indicator">
            <span className="about-hero__scroll-text">Scroll to discover</span>
            <div className="about-hero__scroll-line" />
          </div>
        </section>

        {/* =====================================================
            ⚡ PROBLEM SECTION - ELEGANT DARK
        ===================================================== */}
        <section className="about-problem">
          <div className="about-problem__container">
            <div className="about-problem__grid">
              <div className="about-problem__content">
                <span className="about-problem__badge">The Challenge</span>
                <h2 className="about-problem__title">Healthcare is Broken.<br />We're Fixing It.</h2>
                <div className="about-problem__text">
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
              </div>
              
              <div className="about-problem__visual">
                <div className="about-problem__card">
                  <div className="about-problem__card-icon">⚠️</div>
                  <h4>47%</h4>
                  <p>of patient data is duplicated across systems</p>
                </div>
                <div className="about-problem__card">
                  <div className="about-problem__card-icon">⏱️</div>
                  <h4>2.5h</h4>
                  <p>average daily time spent on manual paperwork</p>
                </div>
                <div className="about-problem__card">
                  <div className="about-problem__card-icon">🏥</div>
                  <h4>3x</h4>
                  <p>higher readmission rates without coordinated care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            💡 SOLUTION SECTION - GRADIENT CARDS
        ===================================================== */}
        <section className="about-solution">
          <div className="about-solution__container">
            <div className="about-solution__header">
              <span className="about-solution__badge">Our Solution</span>
              <h2 className="about-solution__title">A Unified Healthcare<br />Operating System</h2>
              <p className="about-solution__subtitle">
                Four pillars that transform how healthcare organizations operate
              </p>
            </div>

            <div className="about-solution__grid">
              <div className="about-solution__card">
                <div className="about-solution__card-icon">
                  <Users size={24} />
                </div>
                <h3 className="about-solution__card-title">Unified Healthcare Data</h3>
                <p className="about-solution__card-text">
                  A centralized, role-aware data layer connecting patients,
                  doctors, and hospitals in real-time.
                </p>
                <div className="about-solution__card-hover" />
              </div>

              <div className="about-solution__card">
                <div className="about-solution__card-icon">
                  <Brain size={24} />
                </div>
                <h3 className="about-solution__card-title">AI-Assisted Workflows</h3>
                <p className="about-solution__card-text">
                  Intelligent triage, insights, and assistance embedded directly
                  into clinical and operational flows.
                </p>
                <div className="about-solution__card-hover" />
              </div>

              <div className="about-solution__card">
                <div className="about-solution__card-icon">
                  <Building2 size={24} />
                </div>
                <h3 className="about-solution__card-title">Enterprise Dashboards</h3>
                <p className="about-solution__card-text">
                  Purpose-built experiences for patients, doctors, hospital
                  admins, and super admins.
                </p>
                <div className="about-solution__card-hover" />
              </div>

              <div className="about-solution__card">
                <div className="about-solution__card-icon">
                  <Lock size={24} />
                </div>
                <h3 className="about-solution__card-title">Security by Design</h3>
                <p className="about-solution__card-text">
                  Audit logs, strict access control, and data isolation across
                  organizations from day one.
                </p>
                <div className="about-solution__card-hover" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            🚀 DIFFERENTIATORS - GLASS CARDS
        ===================================================== */}
        <section className="about-differentiators">
          <div className="about-differentiators__container">
            <div className="about-differentiators__header">
              <span className="about-differentiators__badge">Why Us</span>
              <h2 className="about-differentiators__title">Not Just Another<br />Healthcare Platform</h2>
            </div>

            <div className="about-differentiators__grid">
              <article className="about-differentiators__card">
                <div className="about-differentiators__card-glow" />
                <Sparkles className="about-differentiators__card-icon" size={32} />
                <h3 className="about-differentiators__card-title">Built for Scale</h3>
                <p className="about-differentiators__card-text">
                  Designed from day one to support millions of users, records, and
                  transactions with predictable performance.
                </p>
              </article>

              <article className="about-differentiators__card">
                <div className="about-differentiators__card-glow" />
                <Brain className="about-differentiators__card-icon" size={32} />
                <h3 className="about-differentiators__card-title">AI-First Architecture</h3>
                <p className="about-differentiators__card-text">
                  AI is not a feature — it's a foundational layer powering
                  guidance, insights, and automation.
                </p>
              </article>

              <article className="about-differentiators__card">
                <div className="about-differentiators__card-glow" />
                <Shield className="about-differentiators__card-icon" size={32} />
                <h3 className="about-differentiators__card-title">Healthcare-Grade Security</h3>
                <p className="about-differentiators__card-text">
                  Strong RBAC, auditability, and tenant isolation aligned with
                  healthcare compliance standards.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* =====================================================
            🔒 TRUST SECTION - COMPLIANCE
        ===================================================== */}
        <section className="about-trust">
          <div className="about-trust__container">
            <div className="about-trust__content">
              <div className="about-trust__header">
                <span className="about-trust__badge">Trust & Compliance</span>
                <h2 className="about-trust__title">Built for<br />Regulated Environments</h2>
              </div>
              
              <div className="about-trust__features">
                <div className="about-trust__feature">
                  <div className="about-trust__feature-check">✓</div>
                  <div className="about-trust__feature-text">
                    <strong>HIPAA-ready architecture</strong>
                    <span>Strict access controls and audit trails</span>
                  </div>
                </div>
                <div className="about-trust__feature">
                  <div className="about-trust__feature-check">✓</div>
                  <div className="about-trust__feature-text">
                    <strong>GDPR compliant by design</strong>
                    <span>Data sovereignty and right to deletion</span>
                  </div>
                </div>
                <div className="about-trust__feature">
                  <div className="about-trust__feature-check">✓</div>
                  <div className="about-trust__feature-text">
                    <strong>Enterprise-grade encryption</strong>
                    <span>AES-256 at rest, TLS 1.3 in transit</span>
                  </div>
                </div>
                <div className="about-trust__feature">
                  <div className="about-trust__feature-check">✓</div>
                  <div className="about-trust__feature-text">
                    <strong>99.95% uptime SLA</strong>
                    <span>Redundant infrastructure across regions</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-trust__visual">
              <div className="about-trust__badge-grid">
                <div className="about-trust__badge-item">HIPAA</div>
                <div className="about-trust__badge-item">GDPR</div>
                <div className="about-trust__badge-item">SOC2</div>
                <div className="about-trust__badge-item">ISO 27001</div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            🌟 VISION SECTION - FULL WIDTH
        ===================================================== */}
        <section className="about-vision">
          <div className="about-vision__container">
            <Heart className="about-vision__icon" size={48} />
            <h2 className="about-vision__title">
              To become the most trusted<br />
              digital healthcare operating system
            </h2>
            <p className="about-vision__text">
              Enabling better outcomes for patients and smarter operations for
              providers worldwide.
            </p>
            <div className="about-vision__cta">
              <a href="/contact" className="about-vision__button">
                Join the mission
                <ArrowRight size={18} className="about-vision__button-icon" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}