export type AppEnv = {
  APP_NAME: string;
  API_BASE_URL: string;
  ENV: 'development' | 'production' | 'staging';
};

const getEnv = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }

  return value;
};

export const loadEnv = (): AppEnv => {
  const env: AppEnv = {
    APP_NAME: getEnv('VITE_APP_NAME'),
    API_BASE_URL: getEnv('VITE_API_BASE_URL'),
    ENV: getEnv('VITE_ENV') as AppEnv['ENV'],
  };

  return env;
};
