import React, { useState } from 'react';
import { useNavigate }  from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import AuthService from '../../services/auth/auth.service';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  label?: string;
  onLogout?: () => void;
}

const variantClasses = {
  primary: 'bg-red-600 hover:bg-red-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  ghost: 'hover:bg-gray-100 text-gray-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'ghost',
  size = 'md',
  showIcon = true,
  label = 'Logout',
  onLogout,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout: clearStore } = useAuthStore();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // 1. Call logout API to invalidate token on server
      await AuthService.logout();
      
      // 2. Clear Zustand store
      clearStore();
      
      // 3. Call optional onLogout callback
      onLogout?.();
      
      // 4. Redirect to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, still clear local state
      clearStore();
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label="Logout"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="w-4 h-4" />
      )}
      <span>{isLoading ? 'Logging out...' : label}</span>
    </button>
  );
};