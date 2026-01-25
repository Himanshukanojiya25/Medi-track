import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth";

/**
 * Public routes which NEVER require auth
 */
const PUBLIC_PATHS = ["/", "/doctors", "/hospitals", "/login"];

export const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Checking authentication…</div>;
  }

  /**
   * ✅ If route is public → allow always
   */
  const isPublicRoute = PUBLIC_PATHS.some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
  );

  if (isPublicRoute) {
    return <Outlet />;
  }

  /**
   * 🔐 Protected route
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  return <Outlet />;
};
