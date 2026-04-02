import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Heart, FileText, LogOut, ChevronDown, Activity, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../../services/auth/auth.service';
import { useAuthStore } from '../../../../stores/useAuthStore';

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  memberSince: string;
}

const mockUser: UserInfo = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Premium Patient',
  memberSince: 'January 2024',
};

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout: clearStore } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 1. Call logout API to invalidate token on server
      await AuthService.logout();
      
      // 2. Clear Zustand store
      clearStore();
      
      // 3. Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local state
      clearStore();
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const menuItems = [
    { icon: <User size={16} />, label: 'My Profile', path: '/patient/profile', divider: false },
    { icon: <Settings size={16} />, label: 'Settings', path: '/patient/settings', divider: false },
    { icon: <Heart size={16} />, label: 'Favorites', path: '/patient/favorites', divider: false },
    { icon: <FileText size={16} />, label: 'Medical Records', path: '/patient/medical-history', divider: false },
    { icon: <Award size={16} />, label: 'Health Rewards', path: '/patient/rewards', divider: false },
    { icon: <Activity size={16} />, label: 'Health Analytics', path: '/patient/analytics', divider: true },
    { 
      icon: <LogOut size={16} />, 
      label: isLoggingOut ? 'Logging out...' : 'Logout', 
      path: '#', 
      divider: false, 
      onClick: handleLogout,
      disabled: isLoggingOut
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {mockUser.avatar ? (
            <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(mockUser.name)
          )}
        </div>
        
        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
          <p className="text-xs text-gray-500">{mockUser.role}</p>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`hidden md:block text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {getInitials(mockUser.name)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{mockUser.name}</h3>
                <p className="text-sm text-blue-100">{mockUser.email}</p>
                <p className="text-xs text-blue-200 mt-1">Member since {mockUser.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 
                    hover:bg-gray-50 transition-colors
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
                {item.divider && <div className="border-t border-gray-100 my-1" />}
              </React.Fragment>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Appointments</p>
                <p className="text-lg font-semibold text-gray-900">12</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Prescriptions</p>
                <p className="text-lg font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};