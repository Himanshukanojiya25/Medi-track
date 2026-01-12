import {
  PromptResolverService,
} from "./prompt-resolver.service";
import {
  ChatSessionService,
} from "./chat-session.service";
import {
  AIEngineService,
} from "./ai-engine.service";


/**
 * Input coming from controller
 */
export interface OrchestrateChatInput {
  sessionId: string;
  userId: string;
  role: "patient" | "doctor" | "hospital-admin" | "super-admin" | "hospital";
  message: string;
  language: "en" | "hi";
  hospitalId?: string;
}

/**
 * Output sent back to controller
 */
export interface OrchestrateChatOutput {
  sessionId: string;
  reply: string;
  model: string;
  tokensUsed: number;
}

/**
 * ChatOrchestratorService
 * ------------------------------------
 * Master brain of AI chat flow
 */
export class ChatOrchestratorService {
  private readonly promptResolver = new PromptResolverService();
  private readonly sessionService = new ChatSessionService();

  /**
   * Main chat handler
   */
  async handleMessage(
    input: OrchestrateChatInput
  ): Promise<OrchestrateChatOutput> {
    // 1️⃣ Validate session & ownership
    const session =
      await this.sessionService.getActiveSession(
        input.sessionId,
        input.userId,
        input.hospitalId
      );

    // 2️⃣ Resolve prompt
    const resolvedPrompt =
      this.promptResolver.resolve({
        role: input.role,
        language: input.language,
        userMessage: input.message,
        context: {
          sessionId: session.id,
          userId: session.userId,
          hospitalId: session.hospitalId,
        },
      });

    // 3️⃣ Call REAL OpenAI engine
    const aiResult =
      await AIEngineService.generateReply(
        resolvedPrompt.finalPrompt
      );

    // 4️⃣ Return clean response
    return {
      sessionId: session.id,
      reply: aiResult.reply,
      model: aiResult.model,
      tokensUsed: aiResult.tokensUsed,
    };
  }
}
