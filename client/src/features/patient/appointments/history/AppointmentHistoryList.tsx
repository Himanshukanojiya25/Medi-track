// client/src/features/patient/appointments/history/AppointmentHistoryList.tsx

import React from 'react';
import { Calendar } from 'lucide-react';
import type { Appointment } from '../../services/appointment.service';
import { AppointmentHistoryCard } from './AppointmentHistoryCard';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton: React.FC = () => (
  <div
    style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 14,
      padding: '16px 18px',
    }}
  >
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#f3f4f6',
          animation: 'pulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            height: 14,
            width: '55%',
            borderRadius: 6,
            backgroundColor: '#f3f4f6',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: 12,
            width: '35%',
            borderRadius: 6,
            backgroundColor: '#f3f4f6',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <div
        style={{
          height: 22,
          width: 80,
          borderRadius: 20,
          backgroundColor: '#f3f4f6',
          animation: 'pulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
    </div>
    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
      {[120, 100].map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: w,
            borderRadius: 6,
            backgroundColor: '#f3f4f6',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ message: string; sub?: string }> = ({ message, sub }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}
    >
      <Calendar size={32} color="#2563eb" />
    </div>
    <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
      {message}
    </p>
    {sub && (
      <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 280, lineHeight: 1.6 }}>
        {sub}
      </p>
    )}
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppointmentHistoryListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppointmentHistoryList: React.FC<AppointmentHistoryListProps> = ({
  appointments,
  isLoading,
  onCancel,
  onReschedule,
  emptyMessage = 'No appointments found',
  emptySubMessage = 'Your appointment history will appear here.',
}) => {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes listItemIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .apt-list-item {
          animation: listItemIn 0.25s ease both;
        }
      `}</style>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState message={emptyMessage} sub={emptySubMessage} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {appointments.map((apt, idx) => (
            <div
              key={apt.id}
              className="apt-list-item"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <AppointmentHistoryCard
                appointment={apt}
                onCancel={onCancel}
                onReschedule={onReschedule}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export { AppointmentHistoryList };
export default AppointmentHistoryList;