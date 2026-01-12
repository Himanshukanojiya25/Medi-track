// src/validations/ai/prompt.validation.ts

import { z } from "zod";

/**
 * Enums
 */
const RoleEnum = z.enum([
  "patient",
  "doctor",
  "hospital-admin",
  "hospital",
  "super-admin",
]);

const LanguageEnum = z.enum(["en", "hi"]);

/**
 * POST /api/ai/prompts/preview
 */
export const previewPromptSchema = z.object({
  body: z.object({
    role: RoleEnum,
    message: z
      .string()
      .min(1, "message is required")
      .max(5000, "message too long"),
    language: LanguageEnum.optional(),
  }),
});

/**
 * POST /api/ai/prompts/update
 */
export const updatePromptSchema = z.object({
  body: z.object({
    role: RoleEnum,
    language: LanguageEnum.optional(),
    content: z
      .string()
      .min(1, "content is required")
      .max(10000, "content too long"),
  }),
});
