export function ContactForm() {
  return (
    <form className="contact-form">
      <input type="text" placeholder="Your Name" />
      <input type="email" placeholder="Email Address" />
      <textarea placeholder="Your Message" rows={5} />
      <button type="submit">Send Message</button>
    </form>
  );
}
