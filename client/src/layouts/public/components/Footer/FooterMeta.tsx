// src/layouts/public/components/Footer/FooterMeta.tsx
import { Link } from "react-router-dom";
import { Shield, Sparkles, Heart, Mail, Phone, MapPin } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export function FooterMeta() {
  return (
    <div className="footer__bottom">
      <div className="footer__brand-section">
        <div className="footer__brand">
          <Link to="/" className="footer__brand-link" aria-label="MediTrack homepage">
            <span className="footer__brand-logo">MediTrack</span>
            <span className="footer__brand-badge">
              <Sparkles size={12} />
              AI-Powered
            </span>
          </Link>
          
          <p className="footer__brand-description">
            Trusted platform for discovering verified doctors,
            hospitals, and AI-powered health support. 
            <span className="footer__brand-highlight"> 10,000+ patients helped</span>
          </p>

          <div className="footer__trust-badge">
            <Shield size={16} />
            <span>HIPAA Compliant</span>
          </div>
        </div>

        <div className="footer__contact">
          <h5 className="footer__contact-title">Get in Touch</h5>
          <ul className="footer__contact-list">
            <li className="footer__contact-item">
              <a href="mailto:support@meditrack.com" className="footer__contact-link">
                <Mail size={14} />
                <span>support@meditrack.com</span>
              </a>
            </li>
            <li className="footer__contact-item">
              <a href="tel:18001234567" className="footer__contact-link">
                <Phone size={14} />
                <span>1-800-123-4567</span>
              </a>
            </li>
            <li className="footer__contact-item">
              <span className="footer__contact-text">
                <MapPin size={14} />
                <span>24/7 Emergency Support</span>
              </span>
            </li>
          </ul>
          
          {/* ⚠️⚠️⚠️ YEH POORA BLOCK HATA DO - YAHI SE ATA HAI "Medical emergency? Call 108" ⚠️⚠️⚠️ */}
          {/* 
          <div className="footer__emergency">
            <span className="footer__emergency-icon">🚨</span>
            <div className="footer__emergency-content">
              <span className="footer__emergency-label">Medical emergency?</span>
              <a href="tel:108" className="footer__emergency-number">Call 108 immediately</a>
            </div>
          </div>
          */}
          
        </div>
      </div>

      <div className="footer__bottom-content">
        <span className="footer__copyright">
          © {CURRENT_YEAR} MediTrack. All rights reserved.
        </span>
        
        <div className="footer__legal-links">
          <Link to="/privacy" className="footer__legal-link">Privacy</Link>
          <span className="footer__bottom-separator" aria-hidden="true">•</span>
          <Link to="/terms" className="footer__legal-link">Terms</Link>
          <span className="footer__bottom-separator" aria-hidden="true">•</span>
          <Link to="/cookies" className="footer__legal-link">Cookies</Link>
        </div>

        <span className="footer__made-with">
          <Heart size={12} className="footer__heart-icon" />
          Made for better healthcare
        </span>
      </div>
    </div>
  );
}