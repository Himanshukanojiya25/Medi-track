// client/src/features/patient/dashboard/DashboardStats.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Upload,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { PatientStatistics } from '../../../types/patient/patient.types';

interface DashboardStatsProps {
  stats: PatientStatistics;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, suffix = '' }) => {
  const trendIcon = trend && trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend && trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />;
  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-400';
  const trendValue = trend ? (trend > 0 ? `+${trend}%` : `${trend}%`) : '0%';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}{suffix}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 mt-2 text-xs ${trendColor}`}>
              {trendIcon}
              <span>{trendValue} from last month</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100',
      trend: 12,
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100',
      trend: 8,
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-100',
      trend: -3,
    },
    {
      title: 'Cancelled',
      value: stats.cancelledAppointments,
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      color: 'bg-red-100',
      trend: -5,
    },
    {
      title: 'Prescriptions',
      value: stats.totalPrescriptions,
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-100',
      trend: 15,
    },
    {
      title: 'Reports',
      value: stats.totalReports,
      icon: <Upload className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-100',
      trend: 7,
    },
    {
      title: 'Favorite Doctors',
      value: stats.favoriteDoctors,
      icon: <TrendingUp className="w-5 h-5 text-pink-600" />,
      color: 'bg-pink-100',
      suffix: '',
    },
    {
      title: 'Total Spent',
      value: stats.totalSpent,
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-100',
      suffix: ' AED',
      trend: 5,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};