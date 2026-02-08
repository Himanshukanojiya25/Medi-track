import type { ID } from "../shared";

/**
 * User profile information
 * Non-sensitive, non-auth data
 */
export interface UserProfile {
  readonly userId: ID;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly phone?: string;
}
