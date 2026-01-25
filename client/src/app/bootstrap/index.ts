import { envBootstrap } from './env.bootstrap';
import { authBootstrap } from './auth.bootstrap';
import type { AuthBootstrapResult } from './auth.bootstrap';

export const runBootstrap = async (): Promise<AuthBootstrapResult> => {
  envBootstrap();
  const authResult = await authBootstrap();
  return authResult;
};
