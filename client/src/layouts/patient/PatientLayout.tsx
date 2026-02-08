import { Outlet } from 'react-router-dom';

/**
 * PatientLayout
 * -------------
 * Used for all patient dashboard pages.
 *
 * Responsibilities:
 * - Dashboard structure
 * - Sidebar / Topbar placeholders
 * - Content outlet
 *
 * NOT responsible for:
 * - Navigation logic
 * - Auth checks
 * - Data fetching
 */
export function PatientLayout() {
  return (
    <div className="dashboard-layout">
      {/* =========================
          SIDEBAR PLACEHOLDER
         ========================= */}
      <aside className="dashboard-sidebar">
        {/* Patient Sidebar component will be mounted here */}
      </aside>

      {/* =========================
          HEADER PLACEHOLDER
         ========================= */}
      <header className="dashboard-header">
        {/* Patient Topbar component will be mounted here */}
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
