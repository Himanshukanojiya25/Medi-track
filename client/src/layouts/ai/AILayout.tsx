import { Outlet } from 'react-router-dom';

/**
 * AILayout
 * --------
 * Used for all AI-related experiences.
 *
 * Responsibilities:
 * - AI workspace shell
 * - Chat panel / floating widget placeholders
 * - Main content outlet
 *
 * NOT responsible for:
 * - AI engine calls
 * - Message state
 * - Usage limits
 * - UI behavior
 */
export function AILayout() {
  return (
    <div className="ai-layout">
      {/* =========================
          AI MAIN WORKSPACE
         ========================= */}
      <main className="ai-main">
        <Outlet />
      </main>

      {/* =========================
          CHAT PANEL PLACEHOLDER
         ========================= */}
      <aside className="ai-chat-panel">
        {/* ChatPanel component will be mounted here */}
      </aside>

      {/* =========================
          FLOATING AI WIDGET
         ========================= */}
      <div className="ai-floating-widget">
        {/* FloatingWidget will be mounted here */}
      </div>
    </div>
  );
}
