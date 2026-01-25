import { Outlet, useNavigate } from "react-router-dom";
import styles from "./website.layout.module.css";

export const WebsiteLayout = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      {/* TEMP HEADER */}
      <header className={styles.header}>
        <div
          className={styles.logo}
          onClick={() => navigate("/")}
        >
          MediTrack
        </div>

        <nav className={styles.nav}>
          <button onClick={() => navigate("/doctors")}>
            Doctors
          </button>
          <button onClick={() => navigate("/hospitals")}>
            Hospitals
          </button>
          <button onClick={() => navigate("/about")}>
            About
          </button>
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
