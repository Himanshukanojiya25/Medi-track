/**
 * Opaque unique identifier
 * - Backend-agnostic (MongoId / UUID / numeric string)
 * - Treated as value object on frontend
 */
export type ID = string;

/**
 * Utility type for entities with ID
 */
export interface WithId {
  readonly id: ID;
}
