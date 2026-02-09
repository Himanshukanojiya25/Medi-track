// src/layouts/public/PublicLayout.tsx

import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SeoShell } from "./components/SeoShell";

export function PublicLayout() {
  return (
    <SeoShell>
      <Header />

      <main role="main" className="public-layout__content">
        <Outlet />
      </main>

      <Footer />
    </SeoShell>
  );
}
