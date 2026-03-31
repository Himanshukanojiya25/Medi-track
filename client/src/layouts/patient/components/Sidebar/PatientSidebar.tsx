// client/src/layouts/patient/components/Sidebar/PatientSidebar.tsx

import React, { useState } from 'react';
import { 
  Home, Calendar, FileText, Activity, User, Heart, 
  Pill, Upload, Bell, Star, Settings, LogOut, Menu,
  X, ChevronLeft, ChevronRight, Hospital
} from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const navSections = [
  {
    title: 'Main Menu',
    items: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
      { path: '/patient/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
      { path: '/patient/prescriptions', label: 'Prescriptions', icon: <FileText size={20} /> },
      { path: '/patient/medical-history', label: 'Medical History', icon: <Activity size={20} /> },
    ],
  },
  {
    title: 'Healthcare',
    items: [
      { path: '/patient/doctors', label: 'Find Doctors', icon: <User size={20} /> },
      { path: '/patient/hospitals', label: 'Hospitals', icon: <Hospital size={20} /> },
      { path: '/patient/favorites', label: 'Favorites', icon: <Heart size={20} /> },
      { path: '/patient/medications', label: 'Medications', icon: <Pill size={20} /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { path: '/patient/uploads', label: 'My Uploads', icon: <Upload size={20} /> },
      { path: '/patient/notifications', label: 'Notifications', icon: <Bell size={20} /> },
      { path: '/patient/feedback', label: 'Feedback', icon: <Star size={20} /> },
      { path: '/patient/profile', label: 'Settings', icon: <Settings size={20} /> },
    ],
  },
];

export const PatientSidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onToggle,
  onMobileClose 
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const shouldExpand = !isCollapsed || isHovered;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white shadow-xl z-30 transition-all duration-300
        ${shouldExpand ? 'w-64' : 'w-20'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        {shouldExpand ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <span className="text-white font-bold text-lg">Patient Portal</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto">
            <Activity className="text-blue-600" size={20} />
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-white hover:bg-blue-500 p-1 rounded-lg transition-colors"
          >
            {shouldExpand ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {shouldExpand && section.title && (
              <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  path={item.path}
                  label={shouldExpand ? item.label : ''}
                  icon={item.icon}
                  onClick={onMobileClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className={`
            flex items-center rounded-lg transition-colors w-full
            ${shouldExpand ? 'px-3 py-2 space-x-3' : 'justify-center py-2'}
            text-red-600 hover:bg-red-50
          `}
        >
          <LogOut size={20} />
          {shouldExpand && <span className="font-medium">Logout</span>}
        </button>
        {shouldExpand && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 Healthcare SaaS</p>
          </div>
        )}
      </div>
    </aside>
  );
};