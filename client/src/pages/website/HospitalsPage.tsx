import styles from "./website.page.module.css";

const HospitalsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Hospitals</h1>

        <p>
          Explore hospitals registered on MediTrack with trusted infrastructure
          and specialists.
        </p>

        <p>
          Detailed hospital profiles and departments will be added soon.
        </p>

        <p className={styles.note}>
          Hospitals listing is under development.
        </p>
      </div>
    </div>
  );
};

export default HospitalsPage;
