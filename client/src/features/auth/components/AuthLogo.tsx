export function AuthLogo() {
  return (
    <div className="auth-logo">
      <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="11" fill="url(#logoGrad)" />
        <path d="M18 8v20M8 18h20" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <span className="auth-logo__text">MediTrack</span>
    </div>
  );
}