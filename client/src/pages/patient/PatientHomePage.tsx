import styles from "./patient-home.page.module.css";
import { useNavigate } from "react-router-dom";

const PatientHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Book Doctor Appointments <br />
            <span>Without Hassle</span>
          </h1>

          <p>
            Find trusted doctors and hospitals near you.
            Book appointments in seconds — no calls, no waiting.
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/doctors")}
            >
              Find Doctors
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={() => navigate("/hospitals")}
            >
              Explore Hospitals
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={styles.features}>
        <h2>Why MediTrack?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Verified Doctors</h3>
            <p>All doctors are verified and trusted by hospitals.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Easy Appointments</h3>
            <p>Book appointments anytime, anywhere in a few clicks.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>No Waiting Lines</h3>
            <p>Save time by avoiding long hospital queues.</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} MediTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PatientHomePage;
