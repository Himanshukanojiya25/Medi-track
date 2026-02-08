/**
 * ErrorLayout
 * -----------
 * Used for error & fallback routes.
 * Keeps UI isolated from app chrome.
 */
export function ErrorLayout() {
  return (
    <div className="error-layout">
      <main className="error-content">
        {/* Error page content will be rendered here */}
        <h1>Something went wrong</h1>
        <p>Please try again later.</p>
      </main>
    </div>
  );
}
