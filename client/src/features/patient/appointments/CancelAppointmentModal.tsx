// client/src/features/patient/appointments/CancelAppointmentModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  XCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';

// ============================================================================
// TYPES
// ============================================================================

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess?: () => void;
}

const CANCEL_REASONS = [
  { id: 'schedule_conflict', label: 'Schedule conflict', icon: Calendar },
  { id: 'changed_mind', label: 'Changed my mind', icon: User },
  { id: 'found_alternative', label: 'Found alternative doctor', icon: User },
  { id: 'unwell', label: 'Not feeling well', icon: AlertTriangle },
  { id: 'other', label: 'Other reason', icon: XCircle },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}) => {
  const { cancelAppointment, isCancelling } = useAppointments();
  
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason for cancellation');
      return;
    }
    
    setError(null);
    
    try {
      await cancelAppointment(appointmentId, {
        reason: selectedReason,
        additionalNotes,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cancel Appointment</h2>
                <p className="text-sm text-gray-500">Please tell us why you're cancelling</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Warning Message */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-red-800">
                <strong>Cancellation Policy:</strong> If you cancel within 24 hours of your appointment, 
                a cancellation fee may apply. Please review our cancellation policy for details.
              </p>
            </div>
            
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => {
                  const Icon = reason.icon;
                  const isSelected = selectedReason === reason.id;
                  return (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setSelectedReason(reason.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-red-600' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                        {reason.label}
                      </span>
                      {isSelected && <CheckCircle size={16} className="ml-auto text-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 resize-none"
                placeholder="Tell us more about why you're cancelling..."
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span>Cancel Appointment</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CancelAppointmentModal;