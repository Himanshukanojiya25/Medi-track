import { PublicRoutes } from './public.routes';

/**
 * AppRoutes
 * ----------
 * Composes all route groups.
 * BrowserRouter is mounted at root (main.tsx).
 */

export const AppRoutes = () => {
  return <PublicRoutes />;
};

export default AppRoutes;
