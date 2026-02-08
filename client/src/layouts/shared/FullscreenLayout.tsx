import { Outlet } from 'react-router-dom';

/**
 * FullscreenLayout
 * ----------------
 * Covers entire viewport.
 * No sidebar, no header.
 */
export function FullscreenLayout() {
  return (
    <div className="fullscreen-layout">
      <main className="fullscreen-content">
        <Outlet />
      </main>
    </div>
  );
}
