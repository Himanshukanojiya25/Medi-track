/**
 * Supported AI interaction modes
 * Keep generic to avoid vendor lock-in
 */
export const AI_MODES = {
  CHAT: "CHAT",
  SUMMARY: "SUMMARY",
  TRIAGE: "TRIAGE",
  INSIGHTS: "INSIGHTS",
} as const;

/**
 * Default behavior per mode
 */
export const AI_MODE_DEFAULTS = {
  CHAT: {
    temperature: 0.7,
    stream: true,
  },
  SUMMARY: {
    temperature: 0.2,
    stream: false,
  },
  TRIAGE: {
    temperature: 0.1,
    stream: false,
  },
  INSIGHTS: {
    temperature: 0.3,
    stream: false,
  },
} as const;
