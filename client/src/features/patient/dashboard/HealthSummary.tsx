// client/src/features/patient/dashboard/HealthSummary.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Thermometer,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  color: string;
}

const mockHealthMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Blood Pressure',
    value: '118/76',
    unit: 'mmHg',
    normalRange: '90/60 - 120/80',
    status: 'normal',
    trend: 'stable',
    trendValue: '0%',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: '2',
    name: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    normalRange: '60-100',
    status: 'normal',
    trend: 'down',
    trendValue: '-2%',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-red-600 bg-red-100',
  },
  {
    id: '3',
    name: 'Blood Sugar',
    value: '98',
    unit: 'mg/dL',
    normalRange: '70-140',
    status: 'normal',
    trend: 'up',
    trendValue: '+3%',
    icon: <Droplet className="w-5 h-5" />,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: '4',
    name: 'Temperature',
    value: '98.6',
    unit: '°F',
    normalRange: '97-99',
    status: 'normal',
    trend: 'stable',
    trendValue: '0%',
    icon: <Thermometer className="w-5 h-5" />,
    color: 'text-orange-600 bg-orange-100',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'text-green-600 bg-green-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'low':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3" />;
    case 'down':
      return <TrendingDown className="w-3 h-3" />;
    default:
      return <Minus className="w-3 h-3" />;
  }
};

export const HealthSummary: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Health Summary</h2>
            <p className="text-sm text-gray-500 mt-1">Key health metrics at a glance</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockHealthMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color}`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {metric.value} <span className="text-xs text-gray-500 font-normal">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-gray-500">Normal: {metric.normalRange}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.trendValue}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 capitalize">{metric.status}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <span className="font-medium">Health Tip:</span> Your vitals look great! Keep up with regular exercise and stay hydrated.
          </p>
        </div>
      </div>
    </div>
  );
};