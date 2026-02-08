import type { ID, ISODateString } from "../shared";
import type { UserRole } from "../role";

/**
 * System audit action categories
 */
export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  ACCESS = "ACCESS",
}

/**
 * Audit log entry
 * Append-only by design
 */
export interface AuditLog {
  readonly id: ID;

  readonly actorId?: ID;       // system actions may not have user
  readonly actorRole?: UserRole;

  readonly action: AuditAction;
  readonly resource: string;  // e.g. "APPOINTMENT", "BILL"
  readonly resourceId?: ID;

  readonly metadata?: Record<string, unknown>;
  readonly occurredAt: ISODateString;
}
