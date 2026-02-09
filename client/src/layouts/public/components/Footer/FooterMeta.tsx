// src/layouts/public/components/Footer/FooterMeta.tsx

const CURRENT_YEAR = new Date().getFullYear();

export function FooterMeta() {
  return (
    <div className="footer__meta">
      <div className="footer__brand">
        <strong>MediTrack</strong>
        <p>Trusted discovery for doctors, hospitals & AI health support.</p>
      </div>

      <div className="footer__copyright">
        <span>© {CURRENT_YEAR} MediTrack. All rights reserved.</span>
      </div>
    </div>
  );
}
