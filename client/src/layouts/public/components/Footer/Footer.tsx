// src/layouts/public/components/Footer/Footer.tsx
import { FooterLinks } from "./FooterLinks";
import { FooterMeta } from "./FooterMeta";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="public-footer"  // ✅ FIXED: .footer → .public-footer
      aria-label="Site footer - MediTrack healthcare platform"
    >
      <div className="public-footer__container">  {/* ✅ FIXED: .footer__container → .public-footer__container */}
        <FooterLinks />
        <FooterMeta />
      </div>
    </footer>
  );
}