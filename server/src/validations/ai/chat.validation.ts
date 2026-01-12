import { z } from "zod";

/**
 * ==========================================
 * Start Chat Validation
 * ==========================================
 * Body intentionally empty
 * role comes from req.user
 */
export const startChatSchema = z.object({
  body: z.object({}),
});

/**
 * ==========================================
 * Send Message Validation
 * ==========================================
 */
export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message is required"),
    language: z.enum(["en", "hi"]).optional(),
  }),
});

/**
 * ==========================================
 * Close Chat Validation
 * ==========================================
 * sessionId comes from URL params
 */
export const closeChatSchema = z.object({
  params: z.object({
    sessionId: z.string().min(1, "Session ID is required"),
  }),
});
