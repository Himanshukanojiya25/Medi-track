import { Outlet } from 'react-router-dom';

/**
 * EmptyLayout
 * -----------
 * Minimal wrapper with no chrome.
 * Used when no layout UI is required.
 */
export function EmptyLayout() {
  return <Outlet />;
}
