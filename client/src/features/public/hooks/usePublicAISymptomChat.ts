import { useState } from "react";

export type AISymptomChatMessage = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export function usePublicAISymptomChat(initialSymptom: string) {
  const [messages, setMessages] = useState<AISymptomChatMessage[]>([
    {
      id: 1,
      role: "user",
      text: initialSymptom,
    },
    {
      id: 2,
      role: "ai",
      text: "Thanks for sharing your symptoms. I’ll ask a few questions to understand better.",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(text: string, onComplete?: () => void) {
    if (!text.trim()) return;

    const userMessage: AISymptomChatMessage = {
      id: Date.now(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 🔹 MOCK AI RESPONSE
    setTimeout(() => {
      const aiMessage: AISymptomChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        text:
          "Understood. Based on this, I have enough information to suggest the next steps.",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      onComplete?.();
    }, 1200);
  }

  return {
    messages,
    isTyping,
    sendMessage,
  };
}
