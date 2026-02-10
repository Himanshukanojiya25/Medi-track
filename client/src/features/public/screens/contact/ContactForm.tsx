export function ContactForm() {
  return (
    <form className="contact-form" noValidate>
      <div className="contact-form__field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Tell us how we can help you…"
          rows={5}
          required
        />
      </div>

      <div className="contact-form__actions">
        <button type="submit">
          Send Message
        </button>

        <p className="contact-form__note">
          Our team typically responds within 24 hours.
        </p>
      </div>
    </form>
  );
}
