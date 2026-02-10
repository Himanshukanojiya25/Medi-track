import { useEffect, useState } from "react";
import {
  SymptomChatBubble,
  AiTypingIndicator,
} from "../../components/ai-symptom";

type ChatMessage = {
  id: number;
  role: "user" | "ai";
  text: string;
};

type Props = {
  initialSymptom: string;
  onComplete: () => void;
};

export function AiSymptomChat({
  initialSymptom,
  onComplete,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Seed initial conversation
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "user",
        text: initialSymptom,
      },
      {
        id: 2,
        role: "ai",
        text:
          "Thanks for sharing. I’m analyzing your symptoms. Can you tell me how long you’ve been experiencing this?",
      },
    ]);
  }, [initialSymptom]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        text:
          "Got it. Based on what you’ve shared, I now have enough information to suggest next steps.",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Move to results screen
      setTimeout(onComplete, 900);
    }, 1200);
  };

  return (
    <section className="ai-symptom-chat">
      <header className="ai-symptom-chat__header">
        <h2>AI Symptom Conversation</h2>
        <p>Answer a few questions so we can guide you better</p>
      </header>

      {/* 🔹 CHAT MESSAGES (NATIVE LIST – A11Y SAFE) */}
      <ul
        className="ai-symptom-chat__messages"
        aria-label="AI symptom conversation"
      >
        {messages.map((msg) => (
          <SymptomChatBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
          />
        ))}

        {isTyping && <AiTypingIndicator />}
      </ul>

      <footer className="ai-symptom-chat__input">
        <input
          type="text"
          value={input}
          placeholder="Add more details…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
          aria-label="Add more symptom details"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
        >
          Send
        </button>
      </footer>
    </section>
  );
}
