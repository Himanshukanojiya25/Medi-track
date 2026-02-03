import { AI_MODES } from "../../constants/ai/ai-mode.constants";
import { AI_ERRORS } from "../../constants/ai/ai-errors.constants";
import { AIContext } from "../../types/ai/ai-context.types";

interface GovernanceInput {
  enabled: boolean;
  aiMode: string;
  role: string;
  allowedRoles: string[];
}

export class AIGovernanceService {
  static validateAccess(input: GovernanceInput): void {
    const { enabled, aiMode, role, allowedRoles } = input;

    if (!enabled || aiMode === AI_MODES.DISABLED) {
      throw AI_ERRORS.AI_DISABLED;
    }

    if (!allowedRoles.includes(role)) {
      throw AI_ERRORS.AI_ACCESS_DENIED;
    }
  }

  static buildContext(params: {
    userId: string;
    role: string;
    hospitalId?: string;
    aiMode: string;
    limits: {
      requestsPerWindow: number;
      windowInSeconds: number;
    };
  }): AIContext {
    return {
      userId: params.userId,
      role: params.role,
      hospitalId: params.hospitalId,
      aiMode: params.aiMode as any,
      limits: params.limits,
    };
  }
}
