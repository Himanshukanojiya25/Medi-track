// client/src/layouts/patient/components/Sidebar/SidebarNavItem.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SidebarNavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  path,
  label,
  icon,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === path || 
    (path !== '/patient/dashboard' && location.pathname.startsWith(path));

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`
        group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {isActive && <ChevronRight size={16} className="text-blue-600" />}
    </Link>
  );
};