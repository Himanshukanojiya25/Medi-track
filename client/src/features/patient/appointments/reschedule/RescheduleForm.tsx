// client/src/features/patient/appointments/reschedule/RescheduleForm.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointmentService } from '../../services/appointment.service';
import type { ID } from '../../../../types/shared';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RescheduleFormData {
  scheduledAt: string; // ISO
  reason?: string;
}

interface RescheduleFormProps {
  doctorId: ID;
  currentScheduledAt: string;
  onSubmit: (data: RescheduleFormData) => void;
  isSubmitting?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDayLabel = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const buildNextDays = (count = 14): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const RESCHEDULE_REASONS = [
  'Schedule conflict',
  'Medical emergency',
  'Doctor unavailable',
  'Personal reasons',
  'Transportation issues',
  'Other',
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const RescheduleForm: React.FC<RescheduleFormProps> = ({
  doctorId,
  currentScheduledAt,
  onSubmit,
  isSubmitting = false,
}) => {
  const days = buildNextDays(14);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Scroll date strip
  const [stripOffset, setStripOffset] = useState(0);
  const VISIBLE = 5;
  const maxOffset = Math.max(0, days.length - VISIBLE);

  // Fetch slots on date select
  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    setSelectedSlot(null);

    appointmentService
      .getAvailableSlots(doctorId, dateStr)
      .then(setSlots)
      .catch(() => setSlotsError('Could not load time slots. Please try another date.'))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, doctorId]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedSlot) return;
    const [h, m] = selectedSlot.split(':').map(Number);
    const dt = new Date(selectedDate);
    dt.setHours(h, m, 0, 0);

    const finalReason = reason === 'Other' ? customReason.trim() : reason;
    onSubmit({ scheduledAt: dt.toISOString(), reason: finalReason || undefined });
  };

  const canSubmit = Boolean(selectedDate && selectedSlot) && !isSubmitting;

  const visibleDays = days.slice(stripOffset, stripOffset + VISIBLE);

  return (
    <>
      <style>{`
        .slot-btn:hover:not(:disabled) { border-color: #2563eb !important; background-color: #eff6ff !important; color: #2563eb !important; }
        .slot-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .reschedule-textarea:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); outline: none; }
        .submit-btn:not(:disabled):hover { filter: brightness(0.92); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div>
        {/* ── Current Appointment Reference ── */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 24,
            display: 'flex',
            gap: 10,
          }}
        >
          <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 2 }}>
              Current appointment
            </p>
            <p style={{ fontSize: 12, color: '#78350f' }}>
              {new Date(currentScheduledAt).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* ── Date Strip ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Calendar size={15} color="#2563eb" />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Select New Date</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setStripOffset((o) => Math.max(0, o - 1))}
              disabled={stripOffset === 0}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: stripOffset === 0 ? 'not-allowed' : 'pointer',
                opacity: stripOffset === 0 ? 0.4 : 1,
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={14} color="#6b7280" />
            </button>

            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
              {visibleDays.map((day) => {
                const isSelected =
                  selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      border: `1.5px solid ${isSelected ? '#2563eb' : '#e5e7eb'}`,
                      borderRadius: 12,
                      backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                      }}
                    >
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: isSelected ? '#ffffff' : '#111827',
                      }}
                    >
                      {day.getDate()}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: isSelected ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                      }}
                    >
                      {day.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStripOffset((o) => Math.min(maxOffset, o + 1))}
              disabled={stripOffset >= maxOffset}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: stripOffset >= maxOffset ? 'not-allowed' : 'pointer',
                opacity: stripOffset >= maxOffset ? 0.4 : 1,
                flexShrink: 0,
              }}
            >
              <ChevronRight size={14} color="#6b7280" />
            </button>
          </div>
        </div>

        {/* ── Time Slots ── */}
        {selectedDate && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Clock size={15} color="#2563eb" />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Available Time Slots — {getDayLabel(selectedDate)}
              </p>
            </div>

            {slotsLoading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 80,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: '#f3f4f6',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : slotsError ? (
              <p style={{ fontSize: 13, color: '#dc2626' }}>{slotsError}</p>
            ) : slots.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 10,
                  border: '1px solid #f3f4f6',
                  fontSize: 13,
                  color: '#9ca3af',
                  textAlign: 'center',
                }}
              >
                No available slots for this date. Please try another day.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      className="slot-btn"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '8px 14px',
                        border: `1.5px solid ${isSelected ? '#2563eb' : '#e5e7eb'}`,
                        borderRadius: 10,
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#2563eb' : '#374151',
                        fontSize: 13,
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Reason ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
            Reason for Rescheduling{' '}
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {RESCHEDULE_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                style={{
                  padding: '7px 13px',
                  border: `1.5px solid ${reason === r ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: 20,
                  backgroundColor: reason === r ? '#eff6ff' : '#ffffff',
                  color: reason === r ? '#2563eb' : '#6b7280',
                  fontSize: 12,
                  fontWeight: reason === r ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {r}
              </button>
            ))}
          </div>
          {reason === 'Other' && (
            <textarea
              className="reschedule-textarea"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please describe your reason..."
              maxLength={300}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 13,
                color: '#111827',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
            />
          )}
        </div>

        {/* ── Submit ── */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: 'none',
            borderRadius: 13,
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'filter 0.15s',
          }}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
              Confirming...
            </>
          ) : (
            'Confirm Reschedule'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </>
  );
};

export { RescheduleForm };
export default RescheduleForm;