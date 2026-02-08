import { Outlet } from 'react-router-dom';

/**
 * AuthLayout
 * ----------
 * System-level authentication layout.
 *
 * Used for:
 * - /auth/login
 * - /auth/register
 * - /auth/forgot-password
 * - /auth/reset-password
 *
 * Responsibilities:
 * - Centered auth experience
 * - Minimal distractions
 * - Secure, focused UI shell
 *
 * NOT responsible for:
 * - Auth logic
 * - API calls
 * - Validation
 * - Session handling
 */
export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {/* =========================
            AUTH HEADER PLACEHOLDER
           ========================= */}
        <header className="auth-header">
          {/* Logo / Title will be mounted here */}
        </header>

        {/* =========================
            AUTH CONTENT
           ========================= */}
        <main className="auth-content">
          <Outlet />
        </main>

        {/* =========================
            AUTH FOOTER PLACEHOLDER
           ========================= */}
        <footer className="auth-footer">
          {/* Links / Copyright */}
        </footer>
      </div>
    </div>
  );
}
