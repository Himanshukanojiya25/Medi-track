// client/src/features/patient/dashboard/QuickActions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarPlus, 
  Search, 
  FileText, 
  Upload, 
  Heart, 
  MessageSquare,
  Activity,
  Clock
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'book-appointment',
    title: 'Book Appointment',
    description: 'Schedule a visit with a doctor',
    icon: <CalendarPlus className="w-6 h-6" />,
    path: '/patient/appointments/book',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'find-doctor',
    title: 'Find Doctor',
    description: 'Search for specialists',
    icon: <Search className="w-6 h-6" />,
    path: '/patient/doctors',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'prescriptions',
    title: 'Prescriptions',
    description: 'View your medications',
    icon: <FileText className="w-6 h-6" />,
    path: '/patient/prescriptions',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'upload-report',
    title: 'Upload Report',
    description: 'Share medical records',
    icon: <Upload className="w-6 h-6" />,
    path: '/patient/uploads',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    description: 'Your saved doctors',
    icon: <Heart className="w-6 h-6" />,
    path: '/patient/favorites',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Share your experience',
    icon: <MessageSquare className="w-6 h-6" />,
    path: '/patient/feedback',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-3`}>
                <div className={action.color}>{action.icon}</div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Emergency</p>
                <p className="text-xs text-red-600">Need immediate help?</p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Call 997
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};