// src/layouts/public/AuthLayout.tsx

import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main role="main" className="auth-layout__content">
      <Outlet />
    </main>
  );
}
