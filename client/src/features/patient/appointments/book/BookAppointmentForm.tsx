// client/src/features/patient/appointments/book/BookAppointmentForm.tsx

import React, { useState } from 'react';
import { User, Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import type { Doctor } from '../../../../types/patient/doctor.types';
import type { DateTimeSelectionValue } from './DateTimeSelection';
import { DoctorSelection } from './DoctorSelection';
import { DateTimeSelection } from './DateTimeSelection';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookAppointmentFormData {
  doctor: Doctor;
  dateTime: DateTimeSelectionValue;
  reason?: string;
  type?: 'IN_PERSON' | 'VIDEO' | 'PHONE';
}

interface BookAppointmentFormProps {
  initialDoctorId?: string;
  onSubmit: (data: BookAppointmentFormData) => void;
  isSubmitting?: boolean;
}

type Step = 0 | 1 | 2;

const STEPS = [
  { label: 'Doctor',   icon: <User size={14} /> },
  { label: 'Schedule', icon: <Calendar size={14} /> },
  { label: 'Details',  icon: <CheckCircle size={14} /> },
];

const CONSULTATION_TYPES = [
  { value: 'IN_PERSON' as const, label: '🏥 In-Person' },
  { value: 'VIDEO'     as const, label: '📹 Video Call' },
  { value: 'PHONE'     as const, label: '📞 Phone Call' },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: Step }> = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
    {STEPS.map((step, idx) => {
      const isDone    = idx < current;
      const isActive  = idx === current;

      return (
        <React.Fragment key={idx}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `2px solid ${isActive ? '#2563eb' : isDone ? '#16a34a' : '#e5e7eb'}`,
                backgroundColor: isActive ? '#2563eb' : isDone ? '#f0fdf4' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#fff' : isDone ? '#16a34a' : '#9ca3af',
                transition: 'all 0.2s',
              }}
            >
              {isDone ? <CheckCircle size={14} color="#16a34a" /> : step.icon}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#2563eb' : isDone ? '#16a34a' : '#9ca3af',
              }}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                backgroundColor: isDone ? '#16a34a' : '#e5e7eb',
                marginBottom: 18,
                transition: 'background-color 0.3s',
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  initialDoctorId,
  onSubmit,
  isSubmitting = false,
}) => {
  const [step, setStep]         = useState<Step>(initialDoctorId ? 1 : 0);
  const [doctor, setDoctor]     = useState<Doctor | null>(null);
  const [dateTime, setDateTime] = useState<DateTimeSelectionValue | null>(null);
  const [reason, setReason]     = useState('');
  const [consultType, setConsultType] = useState<'IN_PERSON' | 'VIDEO' | 'PHONE'>('IN_PERSON');

  const canNext0 = Boolean(doctor);
  const canNext1 = Boolean(dateTime?.date && dateTime?.slot);
  const canSubmit = canNext0 && canNext1 && !isSubmitting;

  const handleFinalSubmit = () => {
    if (!doctor || !dateTime) return;
    onSubmit({ doctor, dateTime, reason: reason.trim() || undefined, type: consultType });
  };

  return (
    <>
      <style>{`
        .book-next-btn:not(:disabled):hover { filter: brightness(0.92); }
        .book-next-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .consult-type-btn:hover { border-color: #bfdbfe !important; }
        .reason-textarea:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); outline: none; }
        @keyframes stepIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        .step-content { animation: stepIn 0.22s ease; }
      `}</style>

      <StepIndicator current={step} />

      {/* ── Step 0: Doctor ── */}
      {step === 0 && (
        <div className="step-content">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 14 }}>
            Choose a Doctor
          </p>
          <DoctorSelection
            selectedDoctorId={doctor?.id}
            onSelect={(d) => {
              setDoctor(d);
              setStep(1);
            }}
          />
        </div>
      )}

      {/* ── Step 1: Schedule ── */}
      {step === 1 && doctor && (
        <div className="step-content">
          {/* Selected doctor mini-card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 11,
              marginBottom: 20,
              cursor: 'pointer',
            }}
            onClick={() => setStep(0)}
          >
            <User size={16} color="#0369a1" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0369a1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doctor.name}
              </p>
              <p style={{ fontSize: 11, color: '#0284c7' }}>{doctor.specialization?.replace('_', ' ')}</p>
            </div>
            <span style={{ fontSize: 11, color: '#0284c7' }}>Change</span>
          </div>

          <DateTimeSelection
            doctorId={doctor.id}
            value={dateTime}
            onChange={setDateTime}
          />

          <button
            className="book-next-btn"
            onClick={() => canNext1 && setStep(2)}
            disabled={!canNext1}
            style={{
              marginTop: 24, width: '100%', padding: '13px 20px', border: 'none',
              borderRadius: 12, backgroundColor: '#2563eb', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: canNext1 ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'filter 0.15s',
            }}
          >
            Continue
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Step 2: Details ── */}
      {step === 2 && doctor && dateTime && (
        <div className="step-content">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>
            Appointment Details
          </p>

          {/* Summary */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#f9fafb',
              border: '1px solid #f3f4f6',
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Doctor</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{doctor.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Date</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                {dateTime.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Time</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{dateTime.slot}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Fee</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>₹{doctor.consultationFee}</span>
            </div>
          </div>

          {/* Consultation type */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              Consultation Type
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {CONSULTATION_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  className="consult-type-btn"
                  onClick={() => setConsultType(ct.value)}
                  style={{
                    flex: 1, padding: '9px 8px',
                    border: `1.5px solid ${consultType === ct.value ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: 10, backgroundColor: consultType === ct.value ? '#eff6ff' : '#fff',
                    color: consultType === ct.value ? '#2563eb' : '#374151',
                    fontSize: 11, fontWeight: consultType === ct.value ? 600 : 400, cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'center',
                  }}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Reason for Visit{' '}
              <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
            </p>
            <textarea
              className="reason-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the visit..."
              maxLength={500}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                borderRadius: 11, fontSize: 13, color: '#111827', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1, padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 12,
                backgroundColor: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              className="book-next-btn"
              onClick={handleFinalSubmit}
              disabled={!canSubmit}
              style={{
                flex: 2, padding: '12px 16px', border: 'none', borderRadius: 12,
                backgroundColor: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'filter 0.15s',
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Booking...
                </>
              ) : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export { BookAppointmentForm };
export default BookAppointmentForm;