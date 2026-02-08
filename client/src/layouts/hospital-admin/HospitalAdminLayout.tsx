import { Outlet } from 'react-router-dom';

/**
 * HospitalAdminLayout
 * -------------------
 * Used for all hospital-admin dashboard pages.
 *
 * Responsibilities:
 * - High-density dashboard structure
 * - Sidebar / Topbar / Context placeholders
 * - Main content outlet
 *
 * NOT responsible for:
 * - Permissions logic
 * - Data fetching
 * - UI behavior
 */
export function HospitalAdminLayout() {
  return (
    <div className="dashboard-layout">
      {/* =========================
          SIDEBAR PLACEHOLDER
         ========================= */}
      <aside className="dashboard-sidebar">
        {/* Hospital Admin Sidebar will be mounted here */}
      </aside>

      {/* =========================
          HEADER PLACEHOLDER
         ========================= */}
      <header className="dashboard-header">
        {/* Topbar / ContextSwitcher will be mounted here */}
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
