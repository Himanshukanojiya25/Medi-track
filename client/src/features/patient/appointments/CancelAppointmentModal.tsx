// client/src/features/patient/appointments/CancelAppointmentModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { X, XCircle, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { appointmentService } from '../services/appointment.service';
import type { ID } from '../../../types/shared';
import { formatDate, formatTime } from '../../../lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CancelAppointmentModalProps {
  appointmentId: ID;
  doctorName: string;
  scheduledAt: string;
  onSuccess: () => void;
  onClose: () => void;
}

// ─── Cancellation Reasons ─────────────────────────────────────────────────────

const CANCEL_REASONS = [
  'Schedule conflict',
  'Feeling better, no longer need appointment',
  'Found another doctor',
  'Financial reasons',
  'Transportation issues',
  'Emergency situation',
  'Doctor not available',
  'Other',
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  appointmentId,
  doctorName,
  scheduledAt,
  onSuccess,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const finalReason =
    selectedReason === 'Other' ? customReason.trim() : selectedReason;

  const canSubmit = Boolean(finalReason) && !isLoading;

  const handleCancel = async () => {
    if (!canSubmit) return;
    try {
      setIsLoading(true);
      setError(null);
      await appointmentService.cancel(appointmentId, { reason: finalReason });
      onSuccess();
    } catch {
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cancel-modal { animation: modalIn 0.22s ease; }
        .cancel-reason-opt:hover { border-color: #bfdbfe !important; background-color: #eff6ff !important; }
        .cancel-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn-primary:not(:disabled):hover { filter: brightness(0.92); }
      `}</style>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        {/* Modal */}
        <div
          className="cancel-modal"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '20px 24px 16px',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <XCircle size={20} color="#dc2626" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  Cancel Appointment
                </h2>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6b7280',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Appointment Summary */}
          <div
            style={{
              margin: '16px 24px',
              padding: 14,
              backgroundColor: '#fafafa',
              borderRadius: 12,
              border: '1px solid #f3f4f6',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              {doctorName}
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: '#6b7280',
                }}
              >
                <Calendar size={12} />
                {formatDate(scheduledAt)}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: '#6b7280',
                }}
              >
                <Clock size={12} />
                {formatTime(scheduledAt)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div
            style={{
              margin: '0 24px 16px',
              padding: '10px 14px',
              backgroundColor: '#fffbeb',
              borderRadius: 10,
              border: '1px solid #fde68a',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
              Repeated cancellations may affect your ability to book future appointments.
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '0 24px 8px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
              Reason for cancellation <span style={{ color: '#dc2626' }}>*</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  className="cancel-reason-opt"
                  onClick={() => setSelectedReason(reason)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    border: `1.5px solid ${selectedReason === reason ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: 10,
                    backgroundColor: selectedReason === reason ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: `2px solid ${selectedReason === reason ? '#2563eb' : '#d1d5db'}`,
                      backgroundColor: selectedReason === reason ? '#2563eb' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {selectedReason === reason && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: selectedReason === reason ? '#1d4ed8' : '#374151',
                      fontWeight: selectedReason === reason ? 500 : 400,
                    }}
                  >
                    {reason}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom reason input */}
            {selectedReason === 'Other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please describe your reason..."
                maxLength={300}
                rows={3}
                style={{
                  width: '100%',
                  marginTop: 10,
                  padding: '10px 14px',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#111827',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            )}

            {/* Error */}
            {error && (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  borderRadius: 8,
                  border: '1px solid #fecaca',
                  fontSize: 13,
                  color: '#dc2626',
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: '16px 24px 20px',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: '1.5px solid #e5e7eb',
                borderRadius: 12,
                backgroundColor: '#ffffff',
                color: '#374151',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Keep Appointment
            </button>
            <button
              className="cancel-btn-primary"
              onClick={handleCancel}
              disabled={!canSubmit}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: 'none',
                borderRadius: 12,
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'filter 0.15s',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  Cancel Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export { CancelAppointmentModal };
export default CancelAppointmentModal;