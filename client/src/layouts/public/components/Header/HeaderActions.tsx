// src/layouts/public/components/Header/HeaderActions.tsx

export function HeaderActions() {
  return (
    <div className="header__actions">
      <a href="/login" className="btn btn--ghost">
        Login
      </a>
      <a href="/signup" className="btn btn--primary">
        Get Started
      </a>
    </div>
  );
}
