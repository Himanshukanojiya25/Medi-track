type Props = {
  role: "user" | "ai";
  text: string;
};

export function SymptomChatBubble({ role, text }: Props) {
  return (
    <li
      className={`symptom-chat-bubble symptom-chat-bubble--${role}`}
    >
      <div className="symptom-chat-bubble__content">
        {text}
      </div>
    </li>
  );
}
