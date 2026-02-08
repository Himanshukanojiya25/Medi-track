import { ENV } from "../env";
import { API_TIMEOUT } from "./timeout.config";

/**
 * Base API configuration
 * Client-agnostic (axios / fetch / grpc-web)
 */
export const API_CONFIG = {
  baseUrl: ENV.API_BASE_URL,

  /**
   * Default request behavior
   */
  timeout: API_TIMEOUT.DEFAULT,

  /**
   * Headers that apply to all requests
   */
  headers: {
    "Content-Type": "application/json",
  },
} as const;
