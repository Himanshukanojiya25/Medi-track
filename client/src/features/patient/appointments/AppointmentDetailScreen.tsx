// client/src/features/patient/appointments/AppointmentDetailScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Star,
  Stethoscope,
  Building2,
  CreditCard,
  Info,
  MoreVertical,
  Edit3,
  Heart,
  Shield,
  Award,
  Video,
  MessageCircle,
} from 'lucide-react';
import { appointmentService } from '../services/appointment.service';
import type { Appointment } from '../services/appointment.service';
import { AppointmentStatus } from '../services/appointment.service';
import { CancelAppointmentModal } from './CancelAppointmentModal';

// ─── Mock Data Helper ─────────────────────────────────────────────────────────

const generateMockAppointment = (id: string): Appointment => {
  const mockAppointments: Record<string, Appointment> = {
    'APT-001': {
      id: 'APT-001',
      patientId: 'PAT-001',
      doctorId: 'DOC-001',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      type: 'IN_PERSON',
      reason: 'Chest pain and shortness of breath for the past 2 weeks. History of high blood pressure.',
      consultationFee: 1500,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'APT-002': {
      id: 'APT-002',
      patientId: 'PAT-001',
      doctorId: 'DOC-002',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Neurologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      type: 'VIDEO',
      reason: 'Severe headaches and occasional dizziness.',
      consultationFee: 2000,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'APT-003': {
      id: 'APT-003',
      patientId: 'PAT-001',
      doctorId: 'DOC-003',
      hospitalId: 'HOS-002',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialization: 'Dermatologist',
      doctorProfilePicture: '',
      hospitalName: 'Skin Care Clinic',
      scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 20,
      status: AppointmentStatus.COMPLETED,
      type: 'IN_PERSON',
      reason: 'Skin rash and allergy concerns.',
      notes: 'Prescribed topical cream. Follow up in 2 weeks if no improvement.',
      consultationFee: 1200,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'APT-004': {
      id: 'APT-004',
      patientId: 'PAT-001',
      doctorId: 'DOC-004',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. James Wilson',
      doctorSpecialization: 'Orthopedic Surgeon',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 60,
      status: AppointmentStatus.CANCELLED,
      type: 'IN_PERSON',
      reason: 'Knee pain and swelling.',
      cancelReason: 'Patient requested cancellation due to schedule conflict',
      consultationFee: 2500,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  return mockAppointments[id] || {
    ...mockAppointments['APT-001'],
    id,
    doctorName: 'Dr. Sample Doctor',
    doctorSpecialization: 'General Physician',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: AppointmentStatus.SCHEDULED,
  };
};

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode; gradient?: string }
> = {
  [AppointmentStatus.SCHEDULED]: {
    label: 'Scheduled',
    color: '#2563eb',
    bg: '#eff6ff',
    icon: <Calendar size={14} />,
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  [AppointmentStatus.CONFIRMED]: {
    label: 'Confirmed',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: <CheckCircle2 size={14} />,
    gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: '#d97706',
    bg: '#fffbeb',
    icon: <RefreshCw size={14} />,
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  },
  [AppointmentStatus.COMPLETED]: {
    label: 'Completed',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: <CheckCircle2 size={14} />,
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: '#fef2f2',
    icon: <XCircle size={14} />,
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
  },
  [AppointmentStatus.NO_SHOW]: {
    label: 'No Show',
    color: '#6b7280',
    bg: '#f9fafb',
    icon: <AlertCircle size={14} />,
  },
  [AppointmentStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: <RefreshCw size={14} />,
  },
};

// ─── Info Row ─────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}> = ({ icon, label, value, valueColor }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
      transition: 'all 0.2s ease',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#2563eb',
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: valueColor ?? '#111827',
          wordBreak: 'break-word',
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '16px 20px',
        borderBottom: '1px solid #f3f4f6',
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      }}
    >
      <span style={{ color: '#2563eb' }}>{icon}</span>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', letterSpacing: '-0.2px' }}>{title}</h3>
    </div>
    <div style={{ padding: '4px 20px' }}>{children}</div>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────

const QuickActionBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}> = ({ icon, label, onClick, variant = 'secondary' }) => {
  const styles = {
    primary: {
      background: '#2563eb',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      background: '#ffffff',
      color: '#374151',
      border: '1.5px solid #e5e7eb',
    },
    danger: {
      background: '#ffffff',
      color: '#dc2626',
      border: '1.5px solid #fecaca',
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px 16px',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...styles[variant],
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.filter = 'brightness(0.92)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#f9fafb';
        if (variant === 'danger') e.currentTarget.style.backgroundColor = '#fef2f2';
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.filter = 'brightness(1)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#ffffff';
        if (variant === 'danger') e.currentTarget.style.backgroundColor = '#ffffff';
      }}
    >
      {icon}
      {label}
    </button>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: React.FC<{ width?: string | number; height?: number; radius?: number }> = ({
  width = '100%',
  height = 16,
  radius = 6,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AppointmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // ── Fetch with Mock Fallback ────────────────────────────────────────────────

  const fetchAppointment = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try real API first
      const data = await appointmentService.getById(id);
      setAppointment(data);
      setUseMockData(false);
    } catch (err) {
      // Fallback to mock data
      console.warn('Using mock data for appointment:', id);
      const mockData = generateMockAppointment(id);
      setAppointment(mockData);
      setUseMockData(true);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const isUpcoming =
    appointment &&
    [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
      appointment.status,
    );

  const canReschedule = isUpcoming;
  const canCancel = isUpcoming;

  const statusCfg = appointment
    ? STATUS_CONFIG[appointment.status]
    : null;

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    fetchAppointment();
  };

  const handleReschedule = () => {
    navigate(`/patient/appointments/${id}/reschedule`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Skeleton width={36} height={36} radius={8} />
          <Skeleton width={200} height={20} />
        </div>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <Skeleton width={64} height={64} radius={16} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton width="60%" height={18} />
              <Skeleton width="40%" height={14} />
              <Skeleton width={80} height={24} radius={20} />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Skeleton width={36} height={36} radius={10} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton width="30%" height={12} />
                <Skeleton width="60%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (error && !appointment) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fecaca',
            borderRadius: 20,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertCircle size={40} color="#ffffff" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            Unable to Load Appointment
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
            {error}
          </p>
          <button
            onClick={fetchAppointment}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 28px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(37,99,235,0.2); }
          50% { box-shadow: 0 0 20px rgba(37,99,235,0.4); }
        }
        .apt-detail-wrap { animation: fadeIn 0.4s ease; }
        .apt-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.12) !important;
          border-color: #bfdbfe !important;
        }
        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="apt-detail-wrap" style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Mock Data Badge */}
        {useMockData && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #fbbf24',
              borderRadius: 12,
              padding: '10px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} color="#ffffff" />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 2 }}>
                Demo Mode
              </p>
              <p style={{ fontSize: 11, color: '#78350f' }}>
                Showing sample data. Connect to backend for real appointments.
              </p>
            </div>
          </div>
        )}

        {/* ── Back + Title ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {/* Status Badge */}
          {statusCfg && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: statusCfg.bg,
                color: statusCfg.color,
                padding: '6px 14px',
                borderRadius: 30,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {statusCfg.icon}
              {statusCfg.label}
            </div>
          )}
        </div>

        {/* ── Doctor Hero Card ── */}
        <div
          className="apt-card-hover"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
            border: '1px solid #e5e7eb',
            borderRadius: 24,
            padding: 28,
            marginBottom: 20,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Doctor info */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 20px -4px rgba(37,99,235,0.3)',
              }}
            >
              <User size={36} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6, letterSpacing: '-0.3px' }}>
                {appointment.doctorName}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: '#6b7280', background: '#f3f4f6', padding: '4px 10px', borderRadius: 20 }}>
                  {appointment.doctorSpecialization}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f59e0b' }}>
                  <Star size={14} fill="#f59e0b" />
                  4.9 (128 reviews)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981' }}>
                  <Award size={14} />
                  12+ years exp
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af' }}>
                  <Heart size={12} />
                  <span>98% patient satisfaction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key details */}
          <InfoRow
            icon={<Calendar size={16} />}
            label="Date"
            value={formatDate(appointment.scheduledAt)}
          />
          <InfoRow
            icon={<Clock size={16} />}
            label="Time"
            value={`${formatTime(appointment.scheduledAt)} · ${appointment.durationMinutes} min`}
          />
          {appointment.hospitalName && (
            <InfoRow
              icon={<Building2 size={16} />}
              label="Location"
              value={appointment.hospitalName}
            />
          )}
          {appointment.type && (
            <InfoRow
              icon={appointment.type === 'VIDEO' ? <Video size={16} /> : <Stethoscope size={16} />}
              label="Consultation Type"
              value={appointment.type === 'VIDEO' ? 'Video Call' : appointment.type === 'PHONE' ? 'Phone Call' : 'In-Person Visit'}
            />
          )}
          <InfoRow
            icon={<FileText size={16} />}
            label="Appointment ID"
            value={`#${appointment.id.slice(-8).toUpperCase()}`}
            valueColor="#6b7280"
          />
        </div>

        {/* ── Reason & Notes ── */}
        {appointment.reason && (
          <SectionCard title="Consultation Details" icon={<MessageCircle size={16} />}>
            <InfoRow
              icon={<FileText size={16} />}
              label="Reason for Visit"
              value={appointment.reason}
            />
            {appointment.notes && (
              <InfoRow
                icon={<FileText size={16} />}
                label="Doctor's Notes"
                value={appointment.notes}
              />
            )}
          </SectionCard>
        )}

        {/* ── Cancellation Info ── */}
        {appointment.status === AppointmentStatus.CANCELLED && appointment.cancelReason && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid #fecaca',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <XCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                  Cancellation Reason
                </p>
                <p style={{ fontSize: 13, color: '#991b1b' }}>{appointment.cancelReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Billing ── */}
        {appointment.consultationFee !== undefined && (
          <SectionCard title="Payment Details" icon={<CreditCard size={16} />}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Consultation Fee</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{formatCurrency(appointment.consultationFee)}</p>
                </div>
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: appointment.isPaid ? '#f0fdf4' : '#fffbeb',
                  color: appointment.isPaid ? '#16a34a' : '#d97706',
                }}
              >
                {appointment.isPaid ? '✓ Paid' : 'Pending'}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {canReschedule && (
            <QuickActionBtn
              icon={<Edit3 size={15} />}
              label="Reschedule"
              onClick={handleReschedule}
              variant="primary"
            />
          )}
          {canCancel && (
            <QuickActionBtn
              icon={<XCircle size={15} />}
              label="Cancel"
              onClick={() => setShowCancelModal(true)}
              variant="danger"
            />
          )}
          {appointment.status === AppointmentStatus.COMPLETED && (
            <QuickActionBtn
              icon={<Calendar size={15} />}
              label="Book Again"
              onClick={() => navigate(`/patient/appointments/book?doctorId=${appointment.doctorId}`)}
              variant="primary"
            />
          )}
        </div>

        {/* Help Section */}
        <div
          style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 20, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={18} color="#ffffff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#075985', marginBottom: 2 }}>
              Need help with your appointment?
            </p>
            <p style={{ fontSize: 12, color: '#0284c7' }}>
              Contact support at +91-XXX-XXXX-XXX or email support@meditrack.com
            </p>
          </div>
        </div>
      </div>

      {showCancelModal && appointment && (
        <CancelAppointmentModal
          appointmentId={appointment.id}
          doctorName={appointment.doctorName}
          scheduledAt={appointment.scheduledAt}
          onSuccess={handleCancelSuccess}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </>
  );
};

export default AppointmentDetailScreen;