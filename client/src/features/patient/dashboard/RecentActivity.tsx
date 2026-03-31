// client/src/features/patient/dashboard/RecentActivity.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Upload, 
  User, 
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle,
  CircleX
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'appointment' | 'prescription' | 'report' | 'profile' | 'feedback';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

// Helper function to format relative time
const formatDistanceToNow = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Appointment Completed',
    description: 'Dr. Sarah Johnson - Cardiology',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Prescription Renewed',
    description: 'Lisinopril 10mg - 30 days supply',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    type: 'report',
    title: 'Lab Report Uploaded',
    description: 'Blood Test Results - March 2024',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: '4',
    type: 'feedback',
    title: 'Feedback Submitted',
    description: 'Rated Dr. Michael Chen 5 stars',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
];

const getActivityIcon = (type: string, status?: string) => {
  switch (type) {
    case 'appointment':
      return status === 'completed' ? 
        <CheckCircle className="w-5 h-5 text-green-600" /> : 
        <Calendar className="w-5 h-5 text-blue-600" />;
    case 'prescription':
      return <FileText className="w-5 h-5 text-purple-600" />;
    case 'report':
      return <Upload className="w-5 h-5 text-orange-600" />;
    case 'profile':
      return <User className="w-5 h-5 text-gray-600" />;
    case 'feedback':
      return <MessageSquare className="w-5 h-5 text-teal-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getActivityBgColor = (type: string) => {
  switch (type) {
    case 'appointment':
      return 'bg-blue-50';
    case 'prescription':
      return 'bg-purple-50';
    case 'report':
      return 'bg-orange-50';
    case 'profile':
      return 'bg-gray-50';
    case 'feedback':
      return 'bg-teal-50';
    default:
      return 'bg-gray-50';
  }
};

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-1">Your latest updates</p>
          </div>
          <button 
            onClick={() => navigate('/patient/activity')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/patient/activity/${activity.id}`)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityBgColor(activity.type)}`}>
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                {activity.status && activity.status !== 'completed' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    {activity.status === 'pending' ? 'Pending Review' : activity.status}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {mockActivities.length === 0 && (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Your activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};