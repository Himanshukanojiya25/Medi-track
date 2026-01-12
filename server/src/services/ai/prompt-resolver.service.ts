// src/services/ai/prompt-resolver.service.ts

/**
 * Supported AI Roles
 */
export type AIRole =
  | "patient"
  | "doctor"
  | "hospital-admin"
  | "super-admin"
  | "hospital";

/**
 * Supported languages
 * (English-only content for SaaS professionalism)
 */
export type Language = "en" | "hi";

/**
 * Prompt resolution input
 */
export interface PromptResolveInput {
  role: AIRole;
  language: Language;
  userMessage: string;
  context: {
    preview?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Prompt resolution output
 * Includes explainability for audit & governance
 */
export interface PromptResolveOutput {
  finalPrompt: string;
  meta: {
    role: AIRole;
    language: Language;
    rulesApplied: string[];
    preview: boolean;
    resolvedAt: Date;
  };
}

/**
 * Internal prompt store (in-memory for now)
 * All prompts written in professional English
 */
type PromptStore = {
  [role in AIRole]: {
    [language in Language]?: string;
  };
};

/**
 * PromptResolverService
 * ------------------------------------------------
 * Enterprise-grade AI behavior controller
 */
export class PromptResolverService {
  /**
   * In-memory prompt templates
   */
  private prompts: PromptStore = {
    patient: {
      en: `
You are a Patient Care Assistant AI.
Use clear, simple, non-technical language.
Do not provide medical diagnoses.
Be empathetic, calm, and supportive.
Explain information in an easy-to-understand manner.
`.trim(),
    },

    doctor: {
      en: `
You are a Doctor Copilot AI.
Assist doctors with summaries, insights, and structured information.
Do not make independent medical decisions.
Never replace clinical judgment.
Keep responses concise and clinically relevant.
`.trim(),
    },

    "hospital-admin": {
      en: `
You are a Hospital Operations Assistant AI.
Focus on operational efficiency, scheduling, utilization, and revenue insights.
Do not provide medical advice or clinical recommendations.
Maintain a professional and analytical tone.
`.trim(),
    },

    "super-admin": {
      en: `
You are a SaaS Platform Super Admin AI.
Focus on system analytics, cost optimization, governance, scalability, and usage insights.
Do not provide hospital-level clinical advice.
Maintain a strategic and executive-level perspective.
`.trim(),
    },

    hospital: {
      en: `
You are an Internal Hospital System AI.
Provide summaries, operational alerts, and automation suggestions.
Do not make clinical or diagnostic decisions.
Focus on efficiency, monitoring, and system-level intelligence.
`.trim(),
    },
  };

  /**
   * Resolve final AI prompt
   */
  resolve(input: PromptResolveInput): PromptResolveOutput {
    this.validateInput(input);

    const rules: string[] = [];

    const systemPrompt = this.getSystemPrompt(
      input.role,
      input.language,
      rules
    );

    const finalPrompt = `
${systemPrompt}

USER_MESSAGE:
${input.userMessage}
`.trim();

    return {
      finalPrompt,
      meta: {
        role: input.role,
        language: input.language,
        rulesApplied: rules,
        preview: Boolean(input.context?.preview),
        resolvedAt: new Date(),
      },
    };
  }

  getActivePromptSnapshot(): PromptStore {
    return JSON.parse(JSON.stringify(this.prompts));
  }

  updatePrompt(input: {
    role: AIRole;
    language: Language;
    content: string;
    updatedBy: string;
  }): void {
    const { role, language, content } = input;

    if (!this.prompts[role]) {
      throw new Error(`Invalid role: ${role}`);
    }

    this.prompts[role][language] = content;
  }

  // ---------------- PRIVATE METHODS ----------------

  private validateInput(input: PromptResolveInput): void {
    if (!input.role) {
      throw new Error("PromptResolver: role is required");
    }
    if (!input.language) {
      throw new Error("PromptResolver: language is required");
    }
    if (!input.userMessage) {
      throw new Error("PromptResolver: userMessage is required");
    }
  }

  private getSystemPrompt(
    role: AIRole,
    _language: Language,
    rules: string[]
  ): string {
    switch (role) {
      case "patient":
        rules.push(
          "No medical diagnosis",
          "Use simple non-technical language",
          "Maintain empathy and reassurance"
        );
        return this.prompts.patient.en!;

      case "doctor":
        rules.push(
          "No autonomous decisions",
          "Assist, never replace clinical judgment",
          "Provide structured summaries"
        );
        return this.prompts.doctor.en!;

      case "hospital-admin":
        rules.push(
          "Hospital-scoped data only",
          "Operational and financial focus",
          "No clinical advice"
        );
        return this.prompts["hospital-admin"].en!;

      case "super-admin":
        rules.push(
          "Cross-hospital visibility allowed",
          "No clinical advice",
          "Focus on governance and scalability"
        );
        return this.prompts["super-admin"].en!;

      case "hospital":
        rules.push(
          "System-level intelligence only",
          "No clinical or diagnostic decisions",
          "Automation and monitoring focus"
        );
        return this.prompts.hospital.en!;

      default:
        throw new Error(`Unsupported AI role: ${role}`);
    }
  }
}
