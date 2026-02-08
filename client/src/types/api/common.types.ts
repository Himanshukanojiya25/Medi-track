/**
 * Generic API metadata
 * Used for tracing & observability
 */
export interface ApiMeta {
  readonly requestId?: string;
  readonly timestamp: string; // ISO 8601
}
