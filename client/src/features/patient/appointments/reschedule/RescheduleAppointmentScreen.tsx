// client/src/features/patient/appointments/reschedule/RescheduleAppointmentScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointment.service';
import { AppointmentStatus } from '../../services/appointment.service';
import type { Appointment } from '../../services/appointment.service';
import { RescheduleForm } from './RescheduleForm';
import type { RescheduleFormData } from './RescheduleForm';
import { RescheduleConfirmation } from './RescheduleConfirmation';

type ScreenStep = 'form' | 'success';

const RescheduleAppointmentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<ScreenStep>('form');
  const [newScheduledAt, setNewScheduledAt] = useState<string>('');

  const fetchAppointment = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await appointmentService.getById(id);
      // Guard: only schedulable statuses can be rescheduled
      if (
        ![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
          data.status,
        )
      ) {
        setError('This appointment cannot be rescheduled.');
      } else {
        setAppointment(data);
      }
    } catch {
      setError('Failed to load appointment details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const handleSubmit = async (data: RescheduleFormData) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await appointmentService.reschedule(id, {
        scheduledAt: data.scheduledAt,
        reason: data.reason,
      });
      setNewScheduledAt(data.scheduledAt);
      setStep('success');
    } catch {
      setSubmitError('Failed to reschedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[80, 300, 200, 250].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 14,
                backgroundColor: '#f3f4f6',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !appointment) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <AlertCircle size={36} color="#dc2626" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
            {error ?? 'Appointment not found'}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '9px 20px',
              border: 'none',
              borderRadius: 10,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Success step ───────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        <RescheduleConfirmation
          appointment={appointment}
          newScheduledAt={newScheduledAt}
        />
      </div>
    );
  }

  // ── Form step ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .reschedule-screen { animation: fadeIn 0.25s ease; }
      `}</style>

      <div
        className="reschedule-screen"
        style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Reschedule Appointment
            </h1>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>
              with {appointment.doctorName}
            </p>
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 24,
          }}
        >
          {submitError && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                fontSize: 13,
                color: '#dc2626',
                marginBottom: 20,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <AlertCircle size={14} />
              {submitError}
            </div>
          )}
          <RescheduleForm
            doctorId={appointment.doctorId}
            currentScheduledAt={appointment.scheduledAt}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

export { RescheduleAppointmentScreen };
export default RescheduleAppointmentScreen;