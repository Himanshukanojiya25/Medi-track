// client/src/layouts/patient/PatientLayout.tsx

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PatientSidebar } from './components/Sidebar';
import { PatientTopbar } from './components/Topbar';
import { MobileNav } from './components/MobileNav';
import AuthService from '../../services/auth/auth.service';

interface PatientLayoutProps {
  children?: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication
  useEffect(() => {
    // Use AuthService to check authentication (uses 'access_token' key)
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    
    console.log('[PatientLayout] Auth check - isAuthenticated:', isAuthenticated);
    console.log('[PatientLayout] User:', user);
    
    if (!isAuthenticated || !user) {
      console.log('[PatientLayout] Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Check if user is patient (case-insensitive)
    const userRole = user.role?.toLowerCase();
    console.log('[PatientLayout] User role:', userRole);
    
    if (userRole !== 'patient') {
      console.log('[PatientLayout] Wrong role, redirecting to:', `/${userRole}/dashboard`);
      navigate(`/${userRole}/dashboard`);
      return;
    }
    
    console.log('[PatientLayout] User is patient, showing dashboard');
  }, [navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <PatientSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>

      {/* Mobile Menu */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300
          ${!isMobile && !isSidebarCollapsed ? 'lg:ml-64' : ''}
          ${!isMobile && isSidebarCollapsed ? 'lg:ml-20' : ''}
        `}
      >
        {/* Topbar */}
        <PatientTopbar
          onMenuClick={handleMobileMenuToggle}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {/* Breadcrumb */}
          <div className="mb-4 md:mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="text-gray-700 font-medium">Patient Portal</span>
              {location.pathname.split('/').filter(Boolean).slice(1).map((segment, index, array) => (
                <React.Fragment key={index}>
                  <span>/</span>
                  <span className={index === array.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Outlet for nested routes */}
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="p-4 text-center text-sm text-gray-500">
            <p>© 2024 Healthcare SaaS Platform. All rights reserved.</p>
            <p className="text-xs mt-1">
              <a href="/privacy" className="hover:text-blue-600">Privacy Policy</a>
              {' | '}
              <a href="/terms" className="hover:text-blue-600">Terms of Service</a>
              {' | '}
              <a href="/help" className="hover:text-blue-600">Help Center</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};