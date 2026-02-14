import { useEffect, useState, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
          "Thank you for sharing that. I'm analyzing your symptoms. To help you better, could you tell me how long you've been experiencing this?",
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

    // Mock AI response with more realistic conversation
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        text:
          "I understand. Based on our conversation, I now have enough information to provide you with personalized recommendations. Let me analyze this with our AI medical database...",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Move to results screen
      setTimeout(onComplete, 1500);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="ai-symptom-chat">
      <header className="ai-symptom-chat__header">
        <div className="ai-symptom-chat__header-content">
          <div className="ai-symptom-chat__header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
              <path d="M12 6v6l4 2" fill="currentColor"/>
            </svg>
          </div>
          <div className="ai-symptom-chat__header-text">
            <h2>AI Health Assistant</h2>
            <p>Our AI is analyzing your symptoms in real-time</p>
          </div>
        </div>
        <div className="ai-symptom-chat__status">
          <span className="ai-symptom-chat__status-dot"></span>
          <span>Active</span>
        </div>
      </header>

      {/* Chat Messages Container */}
      <div className="ai-symptom-chat__container">
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
          <div ref={messagesEndRef} />
        </ul>
      </div>

      <footer className="ai-symptom-chat__footer">
        <div className="ai-symptom-chat__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            aria-label="Type your message"
            className="ai-symptom-chat__input"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="ai-symptom-chat__send-button"
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <p className="ai-symptom-chat__disclaimer">
          Your responses are secure and confidential
        </p>
      </footer>
    </section>
  );
}