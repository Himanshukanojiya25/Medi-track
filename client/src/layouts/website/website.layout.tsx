import { ReactNode } from "react";
import { WebsiteHeader } from "../../components/website/header/header.component";
import { WebsiteFooter } from "../../components/website/footer/footer.component";
import { EmergencyBanner } from "../../components/website/emergency-banner/emergency-banner.component";

interface WebsiteLayoutProps {
  children: ReactNode;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Emergency always visible */}
      <EmergencyBanner />

      {/* Header */}
      <WebsiteHeader />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
}
