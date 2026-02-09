// src/services/api/api.types.ts

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiError = {
  message: string;
  statusCode?: number;
};
