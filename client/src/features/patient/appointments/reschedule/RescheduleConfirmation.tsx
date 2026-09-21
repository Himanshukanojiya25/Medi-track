// client/src/features/patient/appointments/reschedule/RescheduleConfirmation.tsx

import React from 'react';
import { CheckCircle2, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../../services/appointment.service';

interface RescheduleConfirmationProps {
  appointment: Appointment;
  newScheduledAt: string;
}

const RescheduleConfirmation: React.FC<RescheduleConfirmationProps> = ({
  appointment,
  newScheduledAt,
}) => {
  const navigate = useNavigate();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      <style>{`
        @keyframes checkIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reschedule-confirm-wrap > * {
          animation: fadeUp 0.3s ease both;
        }
        .confirm-btn:hover { filter: brightness(0.92); }
        .secondary-btn:hover { background-color: #f3f4f6 !important; }
      `}</style>

      <div
        className="reschedule-confirm-wrap"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px',
          textAlign: 'center',
        }}
      >
        {/* Check icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          <CheckCircle2 size={40} color="#16a34a" />
        </div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#111827',
            marginBottom: 6,
            animationDelay: '0.1s',
          }}
        >
          Appointment Rescheduled!
        </h2>
        <p
          style={{
            fontSize: 14,
            color: '#6b7280',
            marginBottom: 28,
            animationDelay: '0.15s',
          }}
        >
          Your appointment has been successfully rescheduled.
        </p>

        {/* Before → After card */}
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 20,
            marginBottom: 28,
            animationDelay: '0.2s',
          }}
        >
          {/* Doctor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} color="#2563eb" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {appointment.doctorName}
              </p>
              {appointment.doctorSpecialization && (
                <p style={{ fontSize: 12, color: '#6b7280' }}>
                  {appointment.doctorSpecialization}
                </p>
              )}
            </div>
          </div>

          {/* Old → New */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Old */}
            <div
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: '#fef2f2',
                borderRadius: 10,
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6, fontWeight: 600 }}>
                PREVIOUS
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#dc2626',
                  marginBottom: 4,
                }}
              >
                <Calendar size={10} />
                <span>{fmtDate(appointment.scheduledAt)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#dc2626',
                }}
              >
                <Clock size={10} />
                <span>{fmtTime(appointment.scheduledAt)}</span>
              </div>
            </div>

            <ArrowRight size={18} color="#9ca3af" style={{ flexShrink: 0 }} />

            {/* New */}
            <div
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: '#f0fdf4',
                borderRadius: 10,
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6, fontWeight: 600 }}>
                NEW
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#16a34a',
                  marginBottom: 4,
                }}
              >
                <Calendar size={10} />
                <span>{fmtDate(newScheduledAt)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#16a34a',
                }}
              >
                <Clock size={10} />
                <span>{fmtTime(newScheduledAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: 400,
            animationDelay: '0.25s',
          }}
        >
          <button
            className="confirm-btn"
            onClick={() => navigate(`/patient/appointments/${appointment.id}`)}
            style={{
              padding: '13px 20px',
              border: 'none',
              borderRadius: 12,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'filter 0.15s',
            }}
          >
            View Appointment Details
          </button>
          <button
            className="secondary-btn"
            onClick={() => navigate('/patient/appointments')}
            style={{
              padding: '13px 20px',
              border: '1.5px solid #e5e7eb',
              borderRadius: 12,
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
          >
            Back to Appointments
          </button>
        </div>
      </div>
    </>
  );
};

export { RescheduleConfirmation };
export default RescheduleConfirmation;