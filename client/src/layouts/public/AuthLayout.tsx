import { Outlet } from 'react-router-dom';

/**
 * Public AuthLayout
 * ----------------
 * Used for:
 * - Login
 * - Register
 * - Forgot / Reset password
 *
 * Characteristics:
 * - No sidebar
 * - Minimal distraction
 * - Focused form experience
 *
 * NOT responsible for:
 * - Auth logic
 * - Form validation
 * - API calls
 */
export function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* =========================
          AUTH PAGE CONTAINER
         ========================= */}
      <div className="auth-container">
        {/* Header placeholder (logo, title, etc.) */}
        <div className="auth-header">
          {/* AuthHeader component will be injected later */}
        </div>

        {/* =========================
            AUTH CONTENT
           ========================= */}
        <main className="auth-content">
          <Outlet />
        </main>

        {/* =========================
            FOOTER PLACEHOLDER
           ========================= */}
        <div className="auth-footer">
          {/* AuthFooter component will be injected later */}
        </div>
      </div>
    </div>
  );
}
