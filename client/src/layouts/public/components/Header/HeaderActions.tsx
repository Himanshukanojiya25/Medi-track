import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Sparkles,
  Shield,
  Stethoscope,
  Building2,
  HelpCircle,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import AuthService from "../../../../services/auth/auth.service";

export function HeaderActions() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentUser = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleLoginClick = (role?: string) => {
    // Navigate to login page with role param
    if (role) {
      navigate(`/login?role=${role}`);
    } else {
      navigate("/login");
    }
    setIsDropdownOpen(false);
  };

  const getDropdownLinks = () => {
    if (isAuthenticated) {
      const dashboardPath = 
        currentUser?.role === "PATIENT" ? "/patient/dashboard" :
        currentUser?.role === "DOCTOR" ? "/doctor/dashboard" :
        currentUser?.role === "HOSPITAL_ADMIN" ? "/hospital-admin/dashboard" :
        "/super-admin/dashboard";
      
      return [
        {
          to: dashboardPath,
          icon: <LayoutDashboard size={15} />,
          label: "Dashboard",
          onClick: () => navigate(dashboardPath)
        },
        {
          to: "#",
          icon: <LogOut size={15} />,
          label: "Logout",
          onClick: handleLogout
        },
      ];
    }
    
    return [
      {
        to: "#",
        icon: <User size={15} />,
        label: "Patient Sign In",
        onClick: () => handleLoginClick("patient")
      },
      {
        to: "#",
        icon: <Stethoscope size={15} />,
        label: "Doctor Portal",
        onClick: () => handleLoginClick("doctor")
      },
      {
        to: "#",
        icon: <Building2 size={15} />,
        label: "Hospital Portal",
        onClick: () => handleLoginClick("hospital")
      },
    ];
  };

  return (
    <div className="header__actions">
      {/* AI Badge */}
      <div className="header__ai-badge" aria-hidden="true">
        <Sparkles size={13} />
        <span>AI-Powered</span>
      </div>

      {/* Account Dropdown */}
      <div className="header__account" ref={dropdownRef}>
        <button
          type="button"
          className="header__account-toggle"
          aria-label="Open account menu"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(prev => !prev)}
        >
          <div className="header__account-avatar">
            <User size={17} aria-hidden="true" />
          </div>
          <span className="header__account-label">
            {isAuthenticated ? (currentUser?.name || currentUser?.role || 'Account') : 'Account'}
          </span>
          <ChevronDown
            size={14}
            className={`header__account-chevron${isDropdownOpen ? " open" : ""}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="header__dropdown" role="menu">
            <div className="header__dropdown-header">
              <Shield size={14} aria-hidden="true" />
              <span>{isAuthenticated ? 'My Account' : 'Secure Login'}</span>
            </div>

            <div className="header__dropdown-links">
              {getDropdownLinks().map((link) => (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="header__dropdown-link"
                  role="menuitem"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            <div className="header__dropdown-divider" />

            <Link
              to="/help"
              className="header__dropdown-link"
              onClick={() => setIsDropdownOpen(false)}
            >
              <HelpCircle size={15} aria-hidden="true" />
              <span>Need Help?</span>
            </Link>
          </div>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="header__auth-buttons">
        <button
          onClick={() => handleLoginClick()}
          className="header__btn header__btn--secondary"
        >
          <span>Sign In</span>
        </button>
        <Link
          to="/signup"
          className="header__btn header__btn--primary"
        >
          <Sparkles size={14} aria-hidden="true" />
          <span>Get Started</span>
        </Link>
      </div>
    </div>
  );
}