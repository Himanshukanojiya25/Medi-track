export type AIMode = "mock" | "real" | "disabled";

export const AI_MODES = {
  MOCK: "mock" as AIMode,
  REAL: "real" as AIMode,
  DISABLED: "disabled" as AIMode,
};

export const DEFAULT_AI_MODE: AIMode = AI_MODES.MOCK;
