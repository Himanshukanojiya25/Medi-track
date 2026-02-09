const FAQS = [
  { q: "How to book appointment?", a: "Select doctor and choose slot." },
  { q: "Is consultation online?", a: "Depends on doctor availability." },
];

export function FaqList() {
  return (
    <section>
      <h3>How do I book an appointment?</h3>
      <p>Select a doctor and choose a suitable time slot.</p>

      <h3>Is online consultation available?</h3>
      <p>Yes, depending on doctor availability.</p>
    </section>
  );
}

