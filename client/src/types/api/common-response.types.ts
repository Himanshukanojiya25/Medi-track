import type { ApiMeta } from "./common.types";

/**
 * Standard successful API response
 */
export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: ApiMeta;
}
