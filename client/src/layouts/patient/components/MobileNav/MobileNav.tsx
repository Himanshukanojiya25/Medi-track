// client/src/layouts/patient/components/MobileNav/MobileNav.tsx

import React, { useState } from 'react';
import { Menu, X, Calendar, User, Heart, FileText, Pill, Star, Upload, Bell, Home, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { path: '/patient/appointments', label: 'Appointments', icon: <Calendar size={20} /> },
  { path: '/patient/prescriptions', label: 'Prescriptions', icon: <FileText size={20} /> },
  { path: '/patient/medical-history', label: 'Medical History', icon: <Activity size={20} /> },
  { path: '/patient/doctors', label: 'Doctors', icon: <User size={20} /> },
  { path: '/patient/favorites', label: 'Favorites', icon: <Heart size={20} /> },
  { path: '/patient/medications', label: 'Medications', icon: <Pill size={20} /> },
  { path: '/patient/uploads', label: 'Uploads', icon: <Upload size={20} /> },
  { path: '/patient/notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { path: '/patient/profile', label: 'Profile', icon: <User size={20} /> },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/patient/dashboard' && location.pathname === '/patient/dashboard') {
      return true;
    }
    if (path !== '/patient/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <span className="text-white font-bold text-xl">Patient Portal</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-500 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-6 py-3 transition-colors duration-200
                ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }
              `}
            >
              <span className={isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 Healthcare SaaS</p>
          </div>
        </div>
      </div>
    </>
  );
};