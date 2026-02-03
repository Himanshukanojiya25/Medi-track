import { AIMode } from "../../constants/ai/ai-mode.constants";

export interface AIContext {
  userId: string;
  role: string;
  hospitalId?: string;

  aiMode: AIMode;

  limits: {
    requestsPerWindow: number;
    windowInSeconds: number;
  };
}
