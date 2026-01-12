import OpenAI from "openai";
import { ENV } from "../../config/env";

export class AIEngineService {
  private static client = new OpenAI({
    apiKey: ENV.OPENAI_API_KEY,
  });

  static async generateReply(prompt: string): Promise<{
    reply: string;
    model: string;
    tokensUsed: number;
  }> {
    const completion =
      await this.client.chat.completions.create({
        model: ENV.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a calm, empathetic healthcare assistant. Do not give medical diagnosis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

    const choice = completion.choices[0];

    return {
      reply: choice?.message?.content ?? "",
      model: completion.model,
      tokensUsed: completion.usage?.total_tokens ?? 0,
    };
  }
}
