// src/app/config/app.config.ts
import { envConfig } from "./env.config";

interface AppConfigShape {
  name: string;
  version: string;
  mode: string;
  strictMode: boolean;
}

class AppConfig {
  private readonly config: AppConfigShape;

  constructor() {
    const env = envConfig.get();

    this.config = {
      name: "MediTrack",
      version: "1.0.0",
      mode: env.MODE,
      strictMode: env.MODE !== "production",
    };
  }

  get(): Readonly<AppConfigShape> {
    return Object.freeze(this.config);
  }
}

export const appConfig = new AppConfig();
