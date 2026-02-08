import { Outlet } from 'react-router-dom';

/**
 * PublicLayout
 * -------------
 * Used for:
 * - Home page
 * - Search / Listing pages
 * - Public marketing pages
 *
 * Responsibilities:
 * - Page-level structure
 * - SEO-safe wrapper
 * - Header / Footer placeholders
 *
 * NOT responsible for:
 * - Navigation logic
 * - Auth checks
 * - Data fetching
 */
export function PublicLayout() {
  return (
    <div className="public-layout">
      {/* =========================
          HEADER PLACEHOLDER
         ========================= */}
      <header className="public-header">
        {/* Public Header component will be mounted here */}
      </header>

      {/* =========================
          MAIN CONTENT
         ========================= */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* =========================
          FOOTER PLACEHOLDER
         ========================= */}
      <footer className="public-footer">
        {/* Public Footer component will be mounted here */}
      </footer>
    </div>
  );
}
