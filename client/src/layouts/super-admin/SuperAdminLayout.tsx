import { Outlet } from 'react-router-dom';

/**
 * SuperAdminLayout
 * ----------------
 * Used for all super-admin (system level) pages.
 *
 * Responsibilities:
 * - Global system dashboard structure
 * - Sidebar / Topbar / SystemBanner placeholders
 * - Main content outlet
 *
 * NOT responsible for:
 * - Permission enforcement
 * - Data fetching
 * - UI component behavior
 */
export function SuperAdminLayout() {
  return (
    <div className="dashboard-layout">
      {/* =========================
          SIDEBAR PLACEHOLDER
         ========================= */}
      <aside className="dashboard-sidebar">
        {/* Super Admin Sidebar will be mounted here */}
      </aside>

      {/* =========================
          HEADER PLACEHOLDER
         ========================= */}
      <header className="dashboard-header">
        {/* Topbar / SystemBanner will be mounted here */}
      </header>

      {/* =========================
          MAIN CONTENT
         ========================= */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
