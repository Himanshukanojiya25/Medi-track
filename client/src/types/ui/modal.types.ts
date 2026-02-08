/**
 * Supported modal sizes
 */
export enum ModalSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

/**
 * Generic modal payload
 */
export interface ModalPayload<T = unknown> {
  readonly id: string;
  readonly size?: ModalSize;
  readonly data?: T;
}
