// client/src/features/patient/appointments/history/AppointmentHistoryCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Star,
} from 'lucide-react';
import type { Appointment } from '../../services/appointment.service';
import { AppointmentStatus } from '../../services/appointment.service';
import { formatDate, formatTime } from '../../../../lib/utils';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  [AppointmentStatus.SCHEDULED]:   { label: 'Scheduled',   color: '#2563eb', bg: '#eff6ff', dot: '#2563eb' },
  [AppointmentStatus.CONFIRMED]:   { label: 'Confirmed',   color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  [AppointmentStatus.IN_PROGRESS]: { label: 'In Progress', color: '#d97706', bg: '#fffbeb', dot: '#d97706' },
  [AppointmentStatus.COMPLETED]:   { label: 'Completed',   color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  [AppointmentStatus.CANCELLED]:   { label: 'Cancelled',   color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
  [AppointmentStatus.NO_SHOW]:     { label: 'No Show',     color: '#6b7280', bg: '#f9fafb', dot: '#9ca3af' },
  [AppointmentStatus.RESCHEDULED]: { label: 'Rescheduled', color: '#7c3aed', bg: '#f5f3ff', dot: '#7c3aed' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentHistoryCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppointmentHistoryCard: React.FC<AppointmentHistoryCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
}) => {
  const navigate = useNavigate();
  const statusCfg = STATUS_CONFIG[appointment.status];

  const isUpcoming = [
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.CONFIRMED,
  ].includes(appointment.status);

  const isPast = [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ].includes(appointment.status);

  return (
    <>
      <style>{`
        .apt-card { transition: box-shadow 0.18s, transform 0.18s; }
        .apt-card:hover {
          box-shadow: 0 4px 20px rgba(37,99,235,0.08) !important;
          transform: translateY(-1px);
        }
        .apt-card-action:hover { background-color: #f3f4f6 !important; }
        .apt-card-action-blue:hover { background-color: #dbeafe !important; }
      `}</style>

      <div
        className="apt-card"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
        onClick={() => navigate(`/patient/appointments/${appointment.id}`)}
      >
        {/* Top strip for upcoming */}
        {isUpcoming && (
          <div
            style={{
              height: 3,
              background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
            }}
          />
        )}

        <div style={{ padding: '16px 18px' }}>
          {/* Row 1: Doctor + Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {appointment.doctorProfilePicture ? (
                  <img
                    src={appointment.doctorProfilePicture}
                    alt={appointment.doctorName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={20} color="#2563eb" />
                )}
              </div>

              {/* Name + Specialization */}
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {appointment.doctorName}
                </p>
                {appointment.doctorSpecialization && (
                  <p
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {appointment.doctorSpecialization}
                  </p>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                backgroundColor: statusCfg.bg,
                color: statusCfg.color,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: statusCfg.dot,
                }}
              />
              {statusCfg.label}
            </span>
          </div>

          {/* Row 2: Date + Time + Hospital */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 16px',
              marginBottom: 14,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                color: '#6b7280',
              }}
            >
              <Calendar size={12} color="#9ca3af" />
              {formatDate(appointment.scheduledAt)}
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
              <Clock size={12} color="#9ca3af" />
              {formatTime(appointment.scheduledAt)} · {appointment.durationMinutes}min
            </span>
          </div>

          {/* Row 3: Reason */}
          {appointment.reason && (
            <p
              style={{
                fontSize: 12,
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                padding: '7px 10px',
                borderRadius: 8,
                marginBottom: 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              📋 {appointment.reason}
            </p>
          )}

          {/* Row 4: Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              {isUpcoming && onReschedule && (
                <button
                  className="apt-card-action-blue"
                  onClick={() => onReschedule(appointment.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    border: '1px solid #bfdbfe',
                    borderRadius: 8,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <RefreshCw size={11} />
                  Reschedule
                </button>
              )}
              {isUpcoming && onCancel && (
                <button
                  className="apt-card-action"
                  onClick={() => onCancel(appointment.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <XCircle size={11} />
                  Cancel
                </button>
              )}
              {appointment.status === AppointmentStatus.COMPLETED && (
                <button
                  className="apt-card-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Star size={11} />
                  Rate Visit
                </button>
              )}
            </div>

            {/* View Details Arrow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: '#9ca3af',
              }}
            >
              View details
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { AppointmentHistoryCard };
export default AppointmentHistoryCard;