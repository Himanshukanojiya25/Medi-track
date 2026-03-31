// client/src/features/patient/dashboard/UpcomingAppointments.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Phone,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  duration: number;
  location: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Helper functions
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    location: 'City Hospital, Room 204',
    type: 'in-person',
    status: 'confirmed',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 20,
    location: 'Virtual Meeting',
    type: 'video',
    status: 'confirmed',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'phone':
      return <Phone className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const UpcomingAppointments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <p className="text-sm text-gray-500 mt-1">Your scheduled visits</p>
          </div>
          <button 
            onClick={() => navigate('/patient/appointments')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            aria-label="View all appointments"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {mockAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/patient/appointments/${appointment.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/patient/appointments/${appointment.id}`);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{appointment.specialty}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    <span>{formatDate(appointment.dateTime)}</span>
                    <Clock className="w-4 h-4 text-gray-400 ml-2" aria-hidden="true" />
                    <span>{formatTime(appointment.dateTime)} ({appointment.duration} min)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    <span>{appointment.location}</span>
                    <span className="flex items-center space-x-1 ml-2">
                      {getTypeIcon(appointment.type)}
                      <span className="capitalize">{appointment.type}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Open menu options
                  console.log('Open menu for appointment:', appointment.id);
                }}
                aria-label={`More options for appointment with ${appointment.doctorName}`}
                title={`More options for ${appointment.doctorName}`}
              >
                <MoreVertical className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {appointment.type === 'video' && appointment.status === 'confirmed' && (
              <button 
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/patient/appointments/${appointment.id}/join`);
                }}
                aria-label={`Join video call with ${appointment.doctorName}`}
                title={`Join video call with ${appointment.doctorName}`}
              >
                Join Video Call
              </button>
            )}
          </motion.div>
        ))}

        {mockAppointments.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-gray-500">No upcoming appointments</p>
            <button 
              onClick={() => navigate('/patient/appointments/book')}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
              aria-label="Book a new appointment"
            >
              Book an Appointment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};