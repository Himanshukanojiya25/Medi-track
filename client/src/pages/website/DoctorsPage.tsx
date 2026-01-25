import styles from "./website.page.module.css";

const DoctorsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Doctors</h1>

        <p>
          Browse a wide range of verified doctors across multiple specialties.
        </p>

        <p>
          Appointment booking and doctor profiles will be available soon.
        </p>

        <p className={styles.note}>
          Doctors listing is under development.
        </p>
      </div>
    </div>
  );
};

export default DoctorsPage;
