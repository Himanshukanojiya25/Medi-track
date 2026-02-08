import { Outlet } from 'react-router-dom';

/**
 * DoctorLayout
 * ------------
 * Used for all doctor dashboard pages.
 *
 * Responsibilities:
 * - Dashboard shell
 * - Sidebar / Topbar placeholders
 * - Main content outlet
 *
 * NOT responsible for:
 * - Role guards
 * - Data fetching
 * - UI component logic
 */
export function DoctorLayout() {
  return (
    <div className="dashboard-layout">
      {/* =========================
          SIDEBAR PLACEHOLDER
         ========================= */}
      <aside className="dashboard-sidebar">
        {/* Doctor Sidebar component will be mounted here */}
      </aside>

      {/* =========================
          HEADER PLACEHOLDER
         ========================= */}
      <header className="dashboard-header">
        {/* Doctor Topbar / StatusIndicator will be mounted here */}
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
