import { Outlet } from 'react-router-dom';

/**
 * BillingLayout
 * -------------
 * Used for all billing & payments pages.
 *
 * Responsibilities:
 * - Focused billing container
 * - Optional sidebar / summary placeholders
 * - Main content outlet
 *
 * NOT responsible for:
 * - Payment logic
 * - Invoice fetching
 * - Subscription rules
 */
export function BillingLayout() {
  return (
    <div className="billing-layout">
      <div className="billing-container">
        {/* =========================
            HEADER / SUMMARY PLACEHOLDER
           ========================= */}
        <div className="billing-header">
          {/* SummaryBar / BillingHeader will be mounted here */}
        </div>

        {/* =========================
            BILLING CONTENT
           ========================= */}
        <main className="billing-content">
          <Outlet />
        </main>

        {/* =========================
            SIDEBAR PLACEHOLDER (OPTIONAL)
           ========================= */}
        <aside className="billing-sidebar">
          {/* Billing Sidebar (plans/help) will be mounted here */}
        </aside>
      </div>
    </div>
  );
}
