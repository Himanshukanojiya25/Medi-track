// src/app/config/api.config.ts
import { envConfig } from "./env.config";

interface ApiConfigShape {
  baseURL: string;
  timeoutMs: number;
  withCredentials: boolean;
}

class ApiConfig {
  private readonly config: ApiConfigShape;

  constructor() {
    const env = envConfig.get();

    this.config = {
      baseURL: env.API_BASE_URL,
      timeoutMs: 15_000,
      withCredentials: true,
    };
  }

  get(): Readonly<ApiConfigShape> {
    return Object.freeze(this.config);
  }
}

export const apiConfig = new ApiConfig();
