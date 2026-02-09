// src/layouts/public/components/Footer/Footer.tsx

import { FooterLinks } from "./FooterLinks";
import { FooterMeta } from "./FooterMeta";

export function Footer() {
  return (
    <footer role="contentinfo" className="footer">
      <div className="footer__container">
        <FooterLinks />
        <FooterMeta />
      </div>
    </footer>
  );
}
