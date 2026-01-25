import styles from "./website.page.module.css";

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>About MediTrack</h1>

        <p>
          MediTrack is a healthcare management platform designed to simplify
          hospital operations and improve patient experience.
        </p>

        <p>
          Our goal is to bring hospitals, doctors, and patients onto a single
          unified platform with transparency and efficiency.
        </p>

        <p className={styles.note}>
          This page is temporary and will be enhanced later.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
