/**
 * ISO 8601 timestamp string
 * Example: 2026-01-08T10:30:00.000Z
 */
export type ISODateString = string;

/**
 * Standard audit timestamps
 * Used by almost all persisted entities
 */
export interface Timestamps {
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

/**
 * Optional soft-delete timestamps
 * (future-proofing)
 */
export interface SoftDeletable {
  readonly deletedAt?: ISODateString;
}
