// client/src/features/patient/appointments/AppointmentDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  Phone,
  Video,
  MessageSquare,
  FileText,
  Download,
  Edit,
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Clock as ClockIcon,
  Building2,
  CreditCard,
  Receipt,
  Star,
  Mail,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from '../hooks/useAppointments';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { appointmentService } from '../services/appointment.service';
import type { Appointment } from '../../../types/appointment/appointment.types';

// ============================================================================
// TYPES
// ============================================================================

interface AppointmentDetailScreenProps {
  className?: string;
}

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const STATUS_CONFIG = {
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
  },
  PENDING: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: ClockIcon,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
  },
  NO_SHOW: {
    label: 'No Show',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: AlertCircle,
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Edit,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({
  className = '',
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointmentById, isLoading } = useAppointments();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // FETCH APPOINTMENT
  // ==========================================================================

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    try {
      const data = await getAppointmentById(id!);
      setAppointment(data);
    } catch (err) {
      console.error('Failed to load appointment:', err);
      setError('Failed to load appointment details. Please try again.');
    }
  };

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleReschedule = () => {
    navigate(`/patient/appointments/${id}/reschedule`);
  };

  const handleDownloadReceipt = async () => {
    if (!appointment) return;
    
    setIsDownloading(true);
    try {
      const blob = await appointmentService.downloadReceipt(appointment.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointment-receipt-${appointment.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download receipt:', err);
      setError('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleJoinMeeting = () => {
    if (appointment?.meetingLink) {
      window.open(appointment.meetingLink, '_blank');
    }
  };

  const handleAddToCalendar = async () => {
    if (!appointment) return;
    
    try {
      const { calendarUrl } = await appointmentService.addToCalendar(appointment.id);
      window.open(calendarUrl, '_blank');
    } catch (err) {
      console.error('Failed to add to calendar:', err);
      setError('Failed to add to calendar. Please try again.');
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTimeStr = `${date}T${time}`;
      return {
        date: format(new Date(dateTimeStr), 'EEEE, MMMM d, yyyy'),
        time: format(new Date(dateTimeStr), 'h:mm a'),
      };
    } catch {
      return { date: date, time: time };
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const renderStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} border`}>
        <Icon size={14} className={config.color} />
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      </div>
    );
  };

  const renderInfoCard = (
    title: string,
    items: { icon: React.ReactNode; label: string; value: string; action?: React.ReactNode }[]
  ) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item, idx) => (
          <div key={idx} className="px-5 py-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-gray-400">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
              </div>
            </div>
            {item.action && <div>{item.action}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading && !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Appointment</h2>
          <p className="text-gray-500 mb-6">{error || 'Appointment not found'}</p>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);
  const statusConfig = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;
  const isUpcoming = appointment.status === 'CONFIRMED' && new Date(appointment.appointmentDate) > new Date();
  const isCompleted = appointment.status === 'COMPLETED';
  const isCancellable = isUpcoming && appointment.status !== 'CANCELLED';

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back to Appointments</span>
            </button>
            
            <div className="flex items-center gap-3">
              {isUpcoming && (
                <button
                  onClick={handleReschedule}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Reschedule
                </button>
              )}
              
              {isCancellable && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor}`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon size={24} className={statusConfig.color} />
                <div>
                  <h2 className={`text-lg font-semibold ${statusConfig.color}`}>
                    Appointment {statusConfig.label}
                  </h2>
                  {appointment.status === 'CONFIRMED' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Your appointment has been confirmed. Please arrive 15 minutes early.
                    </p>
                  )}
                  {appointment.status === 'CANCELLED' && (
                    <p className="text-sm text-gray-600 mt-1">
                      This appointment has been cancelled. You can book a new appointment anytime.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Appointment Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-base font-medium text-gray-900">{date}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{time} ({appointment.duration} minutes)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900">
                      {appointment.hospital?.name || 'City Hospital'}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {appointment.location || 'Main Building, Floor 2, Room 204'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Reason for Visit</p>
                    <p className="text-base font-medium text-gray-900">{appointment.reason}</p>
                    {appointment.symptoms && appointment.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {appointment.symptoms.map((symptom, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Additional Notes</p>
                      <p className="text-sm text-gray-700 mt-1">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Doctor Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Doctor Information</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                    {appointment.doctor?.name?.charAt(0) || 'D'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor?.name || 'Dr. Sarah Johnson'}</h3>
                    <p className="text-sm text-blue-600 font-medium mt-0.5">{appointment.doctor?.specialization || 'Cardiologist'}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span>{appointment.doctor?.rating || 4.8}</span>
                        <span className="text-gray-400">({appointment.doctor?.totalReviews || 128} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{appointment.doctor?.experience || 12}+ years exp.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/doctors/${appointment.doctorId}`)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    View Full Profile
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Video Consultation Button */}
            {appointment.type === 'VIDEO_CONSULTATION' && appointment.status === 'CONFIRMED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <Video size={20} />
                  Join Video Consultation
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={handleAddToCalendar}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Calendar size={18} className="text-gray-400" />
                  <span>Add to Calendar</span>
                </button>
                
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  ) : (
                    <Download size={18} className="text-gray-400" />
                  )}
                  <span>Download Receipt</span>
                </button>
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Receipt size={18} className="text-gray-400" />
                  <span>View Invoice</span>
                </button>
              </div>
            </div>

            {/* Payment Information */}
            {appointment.totalAmount > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Payment Information</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Consultation Fee</span>
                    <span className="text-gray-900 font-medium">₹{appointment.fee}</span>
                  </div>
                  {appointment.discount && appointment.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{appointment.discount}</span>
                    </div>
                  )}
                  {appointment.tax && appointment.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900">₹{appointment.tax}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-gray-900">₹{appointment.totalAmount}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        appointment.paymentStatus === 'PAID' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {appointment.paymentStatus === 'PAID' ? (
                          <CheckCircle size={10} />
                        ) : (
                          <AlertCircle size={10} />
                        )}
                        {appointment.paymentStatus === 'PAID' ? 'Paid' : 'Payment Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Have questions about your appointment? Contact our support team.
              </p>
              <button className="w-full bg-white text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelAppointmentModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        appointmentId={appointment.id}
        onSuccess={() => {
          setShowCancelModal(false);
          loadAppointment();
        }}
      />
    </div>
  );
};

export default AppointmentDetailScreen;