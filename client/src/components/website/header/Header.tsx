import { useNavigate } from "react-router-dom";
import { WEBSITE_NAVIGATION } from "../../../constants/website";
import styles from "./header.module.css";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => navigate("/")}
      >
        MediTrack
      </div>

      <nav className={styles.nav}>
        {WEBSITE_NAVIGATION.map((item) => (
          <span
            key={item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </span>
        ))}
      </nav>
    </header>
  );
};
