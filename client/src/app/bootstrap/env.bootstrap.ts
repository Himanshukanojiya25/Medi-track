export type AppEnv = {
  APP_NAME: string;
  API_BASE_URL: string;
  ENV: 'development' | 'production' | 'staging';
};

const getEnv = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }

  return value;
};

export const envBootstrap = (): AppEnv => {
  const env: AppEnv = {
    APP_NAME: getEnv('VITE_APP_NAME'),
    API_BASE_URL: getEnv('VITE_API_BASE_URL'),
    ENV: getEnv('VITE_ENV') as AppEnv['ENV'],
  };

  if (!['development', 'production', 'staging'].includes(env.ENV)) {
    throw new Error(`❌ Invalid VITE_ENV value: ${env.ENV}`);
  }

  return env;
};
