import { useNavigate } from "react-router-dom";
import styles from "./home.page.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>MediTrack</h1>

        <p className={styles.subtitle}>
          A unified platform to manage hospitals, doctors, and patients.
        </p>

        <p className={styles.description}>
          This is a temporary landing page while we actively build the core
          product features. You can log in to continue working on different
          modules.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <div className={styles.note}>
          🚧 Product under active development
        </div>
      </div>
    </div>
  );
};

export default HomePage;
