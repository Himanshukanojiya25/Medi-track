/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE?: "development" | "staging" | "production";
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_AI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
