// client/src/features/patient/appointments/book/ConfirmBooking.tsx

import React, { useState } from 'react';
import { 
  User, Calendar, Clock, CreditCard, Stethoscope, 
  AlertCircle, CheckCircle2, ChevronLeft, Video, Phone, Home,
  Shield, MapPin, Building2, FileText, Edit2
} from 'lucide-react';
import type { BookingData } from './BookAppointmentScreen';

interface ConfirmBookingProps {
  bookingData: BookingData;
  onConfirm: (reason?: string, type?: 'IN_PERSON' | 'VIDEO' | 'PHONE') => void;
  onBack: () => void;
}

const CONSULTATION_TYPES = [
  { value: 'IN_PERSON', label: 'In-Person Visit', icon: <Home size={16} />, description: 'Visit doctor at clinic', color: '#2563eb', bg: '#eff6ff' },
  { value: 'VIDEO', label: 'Video Call', icon: <Video size={16} />, description: 'Consult from anywhere', color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'PHONE', label: 'Phone Call', icon: <Phone size={16} />, description: 'Quick teleconsultation', color: '#059669', bg: '#ecfdf5' },
];

export const ConfirmBooking: React.FC<ConfirmBookingProps> = ({ bookingData, onConfirm, onBack }) => {
  const { doctor, scheduledDate, scheduledTime } = bookingData;
  const [reason, setReason] = useState('');
  const [consultationType, setConsultationType] = useState<'IN_PERSON' | 'VIDEO' | 'PHONE'>('IN_PERSON');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReason, setShowReason] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(reason || undefined, consultationType);
      setIsSubmitting(false);
    }, 1000);
  };

  const totalAmount = doctor.consultationFee;

  return (
    <>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .confirm-animate { animation: fadeSlide 0.4s ease; }
        .type-card {
          transition: all 0.2s ease;
        }
        .type-card:hover:not(.selected) {
          border-color: #bfdbfe !important;
          background: #f8fafc !important;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="confirm-animate">
        {/* Demo Mode Badge */}
        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Shield size={16} className="text-amber-600" />
          <p className="text-xs text-amber-700 flex-1 font-medium">
            Demo Mode: Booking is simulated. Real booking will be processed in production.
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Booking Summary</h3>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Doctor */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                <p className="font-semibold text-gray-900">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </div>

            {/* Hospital */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Hospital</p>
                <p className="font-semibold text-gray-900">{doctor.hospitalName}</p>
                {doctor.hospitalAddress && (
                  <p className="text-sm text-gray-500">{doctor.hospitalAddress}</p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                <p className="font-semibold text-gray-900">{formatDate(scheduledDate)}</p>
                <p className="text-sm text-gray-500">at {scheduledTime}</p>
              </div>
            </div>

            {/* Fee */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <CreditCard size={18} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Fee</p>
                <p className="font-semibold text-gray-900">₹{totalAmount}</p>
                <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Consultation Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {CONSULTATION_TYPES.map(type => {
              const isSelected = consultationType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setConsultationType(type.value as any)}
                  className={`type-card p-3 rounded-xl border-2 text-center transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center`} style={{ background: type.bg, color: type.color }}>
                    {type.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason for Visit (Optional) */}
        <div className="mb-6">
          <button
            onClick={() => setShowReason(!showReason)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FileText size={14} />
            {showReason ? 'Hide reason' : 'Add reason for visit (optional)'}
            <Edit2 size={12} />
          </button>
          
          {showReason && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for consultation..."
              className="w-full mt-3 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Confirm Booking
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmBooking;