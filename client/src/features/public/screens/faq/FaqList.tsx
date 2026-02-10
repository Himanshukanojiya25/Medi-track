import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: "what-is-meditrack",
    question: "What is MediTrack?",
    answer:
      "MediTrack is an intelligent healthcare SaaS platform that connects patients, doctors, and hospitals through secure, scalable, and AI-powered systems.",
  },
  {
    id: "who-can-use-meditrack",
    question: "Who can use MediTrack?",
    answer:
      "MediTrack is built for patients, doctors, hospital administrators, and healthcare organizations of all sizes.",
  },
  {
    id: "data-security",
    question: "How does MediTrack protect my data?",
    answer:
      "We follow enterprise-grade security practices including role-based access control, audit logging, encryption, and strict data governance.",
  },
  {
    id: "ai-usage",
    question: "How is AI used in MediTrack?",
    answer:
      "AI is used to assist patients in symptom analysis, support doctors with insights, and improve operational efficiency — always with human oversight.",
  },
];

export function FaqList() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="faq-list">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id} className="faq-item">
            <button
              type="button"
              className="faq-question"
              aria-controls={`faq-panel-${faq.id}`}
              id={`faq-button-${faq.id}`}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
            >
              <span className="faq-question__text">
                {faq.question}
              </span>

              <span
                className="faq-question__icon"
                aria-hidden="true"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div
              id={`faq-panel-${faq.id}`}
              role="region"
              aria-labelledby={`faq-button-${faq.id}`}
              hidden={!isOpen}
              className="faq-answer"
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
