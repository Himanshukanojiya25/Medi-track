import styles from "./website.page.module.css";

const ContactPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Contact Us</h1>

        <p>
          For any queries or partnership discussions, feel free to reach out.
        </p>

        <ul className={styles.list}>
          <li>Email: support@meditrack.com</li>
          <li>Phone: +91-XXXXXXXXXX</li>
          <li>Location: India</li>
        </ul>

        <p className={styles.note}>
          Contact details are placeholders for now.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
