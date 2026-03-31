// client/src/features/patient/dashboard/PatientDashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  Bell, 
  WifiOff, 
  ChevronRight,
  Calendar
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { DashboardStats } from './DashboardStats';
import { UpcomingAppointments } from './UpcomingAppointments';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { HealthSummary } from './HealthSummary';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useAppointments } from '../hooks/useAppointments';
import { useNotifications } from '../hooks/useNotifications';

export const PatientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { profile, isLoading: profileLoading, refetch: refetchProfile } = usePatientProfile();
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useAppointments();
  const { unreadCount } = useNotifications();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProfile(), refetchStats()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isLoading = profileLoading || statsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="md:hidden">
              <button onClick={() => navigate('/patient/notifications')} className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && (
              <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Offline</span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh dashboard"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Welcome Overview */}
              {profile && (
                <DashboardOverview 
                  patient={profile} 
                  nextAppointment={stats && stats.upcomingAppointments > 0 ? {
                    doctorName: "Dr. Sarah Johnson",
                    specialty: "Cardiology",
                    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    location: "City Hospital, Room 204"
                  } : undefined}
                />
              )}

              {/* Stats Grid */}
              {stats && <DashboardStats stats={stats} />}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  <UpcomingAppointments />
                  <RecentActivity />
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  <QuickActions />
                  <HealthSummary />
                  
                  {/* Upcoming Reminders Card */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Health Reminders</h3>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Take evening medication at 8 PM</span>
                      </li>
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Blood pressure check tomorrow</span>
                      </li>
                      <li className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>Annual checkup due in 2 weeks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};