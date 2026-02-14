import { Link } from "react-router-dom";
import { User, Sparkles, Shield, Stethoscope, Building2, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function HeaderActions() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header__actions">
      <div className="header__premium-badge">
        <Sparkles className="header__premium-icon" size={14} aria-hidden="true" />
        <span className="header__premium-text">AI-Powered</span>
      </div>

      <div className="header__user-container" ref={dropdownRef}>
        {/* ✅ HARDCODED "false" - NO EXPRESSION */}
        <button
          type="button"
          className="header__user-toggle"
          aria-label="User menu"
          aria-expanded="false"
          aria-haspopup="dialog"
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        >
          <div className="header__user-avatar">
            <User className="header__user-icon" size={18} aria-hidden="true" />
          </div>
          <span className="header__user-text">Account</span>
          <div className="header__user-chevron" aria-hidden="true" />
        </button>

        {isUserDropdownOpen && (
          <div 
            className="header__dropdown-menu" 
            role="region" 
            aria-label="Account menu options"
          >
            <div className="header__dropdown-header">
              <Shield className="header__dropdown-shield" size={16} aria-hidden="true" />
              <span className="header__dropdown-title">Secure Login</span>
            </div>
            
            <div className="header__dropdown-content">
              <Link 
                to="/login" 
                className="header__dropdown-link" 
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <User size={16} aria-hidden="true" />
                <span>Sign In</span>
              </Link>
              
              <Link 
                to="/doctor/login" 
                className="header__dropdown-link" 
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <Stethoscope size={16} aria-hidden="true" />
                <span>Doctor Portal</span>
              </Link>
              
              <Link 
                to="/hospital/login" 
                className="header__dropdown-link" 
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <Building2 size={16} aria-hidden="true" />
                <span>Hospital Portal</span>
              </Link>
              
              <div 
                className="header__dropdown-divider" 
                role="separator" 
                aria-hidden="true" 
              />
              
              <Link 
                to="/help" 
                className="header__dropdown-link" 
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <HelpCircle size={16} aria-hidden="true" />
                <span>Need Help?</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="header__auth-buttons">
        <Link 
          to="/login" 
          className="header__auth-button header__auth-button--secondary"
        >
          <span className="header__auth-button-text">Sign In</span>
          <div className="header__auth-button-glow" aria-hidden="true" />
        </Link>
        
        <Link 
          to="/signup" 
          className="header__auth-button header__auth-button--primary"
        >
          <Sparkles className="header__auth-button-icon" size={16} aria-hidden="true" />
          <span className="header__auth-button-text">Get Started Free</span>
          <div className="header__auth-button-shine" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}