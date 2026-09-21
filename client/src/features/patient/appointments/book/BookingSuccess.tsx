// client/src/features/patient/appointments/book/BookingSuccess.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Download, 
  Share2, 
  CalendarPlus, 
  ChevronRight, 
  Sparkles,
  CreditCard,
  Home,
  Video,
  Phone
} from 'lucide-react';
import type { BookingData } from './BookAppointmentScreen';

interface BookingSuccessProps {
  bookingData: BookingData;
  onNewBooking: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ bookingData, onNewBooking }) => {
  const navigate = useNavigate();
  const { doctor, scheduledDate, scheduledTime, type, reason } = bookingData;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddToCalendar = () => {
    alert('Calendar invitation would be sent in production');
  };

  const handleShare = () => {
    alert('Share link would be generated in production');
  };

  const bookingId = `APT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <>
      <style>{`
        @keyframes successPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .success-icon { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .success-item { animation: slideUp 0.4s ease both; }
      `}</style>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px' }}>
        {/* Success Icon */}
        <div className="success-icon text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 size={52} color="#fff" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked! 🎉</h1>
          <p className="text-gray-500">
            Your appointment has been confirmed. A confirmation has been sent to your email.
          </p>
        </div>

        {/* Booking ID */}
        <div className="text-center mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Booking ID</p>
          <p className="text-lg font-mono font-bold text-gray-800">{bookingId}</p>
        </div>

        {/* Appointment Details Card */}
        <div className="success-item bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-blue-100">
            <h3 className="font-semibold text-gray-800">Appointment Details</h3>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Doctor */}
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <User size={20} color="#fff" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                <p className="font-bold text-gray-900">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </div>

            {/* Hospital */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                <p className="font-medium text-gray-800">{doctor.hospitalName}</p>
                {doctor.hospitalAddress && (
                  <p className="text-xs text-gray-500">{doctor.hospitalAddress}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                <p className="font-medium text-gray-800">{formatDate(scheduledDate)}</p>
                <p className="text-sm text-gray-500">at {scheduledTime}</p>
              </div>
            </div>

            {/* Consultation Type */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                {type === 'VIDEO' && <Video size={16} className="text-purple-600" />}
                {type === 'PHONE' && <Phone size={16} className="text-purple-600" />}
                {type === 'IN_PERSON' && <Home size={16} className="text-purple-600" />}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Mode</p>
                <p className="font-medium text-gray-800">
                  {type === 'VIDEO' ? 'Video Call' : type === 'PHONE' ? 'Phone Call' : 'In-Person Visit'}
                </p>
              </div>
            </div>

            {/* Fee */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <CreditCard size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                <p className="font-bold text-gray-900">₹{doctor.consultationFee}</p>
                <p className="text-xs text-gray-500">Payment: Online (Demo)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="success-item grid grid-cols-2 gap-3 mb-6" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <CalendarPlus size={16} />
            Add to Calendar
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>

        {/* Action Buttons */}
        <div className="success-item space-y-3" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => navigate(`/patient/appointments/${bookingId.toLowerCase()}`)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            View Appointment Details
            <ChevronRight size={16} />
          </button>
          <button
            onClick={onNewBooking}
            className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
          >
            Book Another Appointment
          </button>
        </div>

        {/* Help Section */}
        <div className="success-item mt-8 text-center" style={{ animationDelay: '0.35s' }}>
          <p className="text-xs text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@meditrack.com" className="text-blue-600 hover:underline">
              support@meditrack.com
            </a>{' '}
            or call{' '}
            <a href="tel:+911800XXXXXX" className="text-blue-600 hover:underline">
              +91-1800-XXX-XXXX
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default BookingSuccess;