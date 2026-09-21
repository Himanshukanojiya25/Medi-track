import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, WifiOff, Calendar, Clock, User, ChevronRight, Star, Building2, Video, Phone, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { appointmentService } from '../../services/appointment.service';
import type { Appointment } from '../../services/appointment.service';
import { AppointmentStatus, AppointmentType } from '../../services/appointment.service';
import { AppointmentFilter } from './AppointmentFilter';
import type { AppointmentFilterState } from './AppointmentFilter';
import { AppointmentHistoryList } from './AppointmentHistoryList';
import { CancelAppointmentModal } from '../CancelAppointmentModal';

// ─── MOCK DATA GENERATOR ──────────────────────────────────────────────────────

const generateMockAppointments = (): Appointment[] => {
  const today = new Date();
  
  return [
    {
      id: 'mock-001',
      patientId: 'PAT-001',
      doctorId: 'DOC-001',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 30).toISOString(),
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      type: AppointmentType.IN_PERSON,
      reason: 'Chest pain and shortness of breath',
      consultationFee: 1500,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-002',
      patientId: 'PAT-001',
      doctorId: 'DOC-002',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Neurologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 0).toISOString(),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.VIDEO,
      reason: 'Severe headaches and occasional dizziness',
      consultationFee: 2000,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-003',
      patientId: 'PAT-001',
      doctorId: 'DOC-003',
      hospitalId: 'HOS-002',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialization: 'Dermatologist',
      doctorProfilePicture: '',
      hospitalName: 'Skin Care Clinic',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 11, 15).toISOString(),
      durationMinutes: 20,
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.IN_PERSON,
      reason: 'Skin rash and allergy concerns',
      consultationFee: 1200,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-004',
      patientId: 'PAT-001',
      doctorId: 'DOC-004',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. James Wilson',
      doctorSpecialization: 'Orthopedic Surgeon',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0).toISOString(),
      durationMinutes: 60,
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.PHONE,
      reason: 'Knee pain and swelling',
      consultationFee: 2500,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-005',
      patientId: 'PAT-001',
      doctorId: 'DOC-005',
      hospitalId: 'HOS-003',
      doctorName: 'Dr. Priya Sharma',
      doctorSpecialization: 'Pediatrician',
      doctorProfilePicture: '',
      hospitalName: "Children's Health Center",
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 16, 30).toISOString(),
      durationMinutes: 30,
      status: AppointmentStatus.CANCELLED,
      type: AppointmentType.IN_PERSON,
      reason: 'Child fever and cough',
      consultationFee: 1000,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// ─── Welcome Banner Component ─────────────────────────────────────────────────

const WelcomeBanner: React.FC<{ userName?: string }> = ({ userName = 'Patient' }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      borderRadius: 20,
      padding: '20px 24px',
      marginBottom: 24,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Sparkles size={24} color="#ffffff" />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Welcome back, {userName}! 👋
        </h2>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 16 }}>
        Your health is our priority. Here's your appointment summary.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0 }}>12</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Total Visits</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0 }}>98%</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Satisfaction</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0 }}>5</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>This Month</p>
        </div>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: -20,
        top: -20,
        width: 120,
        height: 120,
        borderRadius: 60,
        background: 'rgba(255,255,255,0.1)',
        zIndex: 1,
      }}
    />
  </div>
);

// ─── Stats Card Component ─────────────────────────────────────────────────────

const StatsCard: React.FC<{ total: number; upcoming: number; completed: number }> = ({ total, upcoming, completed }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginBottom: 24,
    }}
  >
    <div
      style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
        borderRadius: 16,
        padding: '14px 12px',
        textAlign: 'center',
      }}
    >
      <Calendar size={20} color="#2563eb" style={{ marginBottom: 6 }} />
      <p style={{ fontSize: 22, fontWeight: 700, color: '#1e40af', margin: 0 }}>{total}</p>
      <p style={{ fontSize: 11, color: '#3b82f6', margin: 0, fontWeight: 500 }}>Total</p>
    </div>
    <div
      style={{
        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        borderRadius: 16,
        padding: '14px 12px',
        textAlign: 'center',
      }}
    >
      <Clock size={20} color="#16a34a" style={{ marginBottom: 6 }} />
      <p style={{ fontSize: 22, fontWeight: 700, color: '#166534', margin: 0 }}>{upcoming}</p>
      <p style={{ fontSize: 11, color: '#22c55e', margin: 0, fontWeight: 500 }}>Upcoming</p>
    </div>
    <div
      style={{
        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
        borderRadius: 16,
        padding: '14px 12px',
        textAlign: 'center',
      }}
    >
      <CheckCircle2 size={20} color="#ea580c" style={{ marginBottom: 6 }} />
      <p style={{ fontSize: 22, fontWeight: 700, color: '#9a3412', margin: 0 }}>{completed}</p>
      <p style={{ fontSize: 11, color: '#f97316', margin: 0, fontWeight: 500 }}>Completed</p>
    </div>
  </div>
);

// ─── Quick Actions ───────────────────────────────────────────────────────────

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => navigate('/patient/appointments/book')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          border: 'none',
          borderRadius: 14,
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Plus size={16} />
        Book New Appointment
      </button>
      <button
        onClick={() => navigate('/patient/doctors')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 16px',
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: 14,
          color: '#374151',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2563eb';
          e.currentTarget.style.backgroundColor = '#eff6ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
      >
        <User size={16} />
        Find Doctors
      </button>
    </div>
  );
};

// ─── Error Banner ─────────────────────────────────────────────────────────────

const ErrorBanner: React.FC<{
  message: string;
  isNetworkError: boolean;
  onRetry: () => void;
}> = ({ message, isNetworkError, onRetry }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 18px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      border: '1px solid #fecaca',
      borderRadius: 14,
      marginBottom: 20,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <WifiOff size={16} color="#ffffff" />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#991b1b', marginBottom: 2 }}>
          Connection Error
        </p>
        <p style={{ fontSize: 12, color: '#7f1d1d' }}>{message}</p>
      </div>
    </div>
    <button
      onClick={onRetry}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: '#ffffff',
        border: '1px solid #fecaca',
        borderRadius: 10,
        color: '#dc2626',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
    >
      <RefreshCw size={12} />
      Retry
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AppointmentsHistoryScreen: React.FC = () => {
  const navigate = useNavigate();

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilterState>({ tab: 'ALL' });
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // ── Fetch with Mock Fallback ───────────────────────────────────────────────

  const fetchAppointments = useCallback(
    async (reset = false) => {
      const currentPage = reset ? 1 : page;

      try {
        reset ? setIsLoading(true) : setIsFetchingMore(true);
        setError(null);
        setIsNetworkError(false);

        // Try real API first
        const res = await appointmentService.list({
          type: filters.tab === 'ALL' ? undefined : filters.tab,
          status: filters.status,
          page: currentPage,
          limit: 10,
        });

        const incoming = res.data ?? [];
        setAllAppointments((prev) => reset ? incoming : [...prev, ...incoming]);
        setHasMore(Boolean(res.pagination?.hasNextPage));
        if (!reset) setPage((p) => p + 1);
        setUseMockData(false);

      } catch (err: any) {
        // Fallback to mock data
        console.warn('API failed, using mock data');
        const mockData = generateMockAppointments();
        
        // Filter mock data based on filters
        let filteredMock = [...mockData];
        if (filters.tab === 'UPCOMING') {
          filteredMock = filteredMock.filter(a => 
            new Date(a.scheduledAt) > new Date() && 
            a.status !== AppointmentStatus.CANCELLED &&
            a.status !== AppointmentStatus.COMPLETED
          );
        } else if (filters.tab === 'PAST') {
          filteredMock = filteredMock.filter(a => 
            new Date(a.scheduledAt) < new Date() ||
            a.status === AppointmentStatus.COMPLETED ||
            a.status === AppointmentStatus.CANCELLED
          );
        }
        
        if (filters.status) {
          filteredMock = filteredMock.filter(a => a.status === filters.status);
        }

        setAllAppointments(reset ? filteredMock : [...allAppointments, ...filteredMock]);
        setHasMore(false);
        setUseMockData(true);
        setError(null);

      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [filters.tab, filters.status, page, allAppointments.length],
  );

  useEffect(() => {
    setPage(1);
    setAllAppointments([]);
    fetchAppointments(true);
  }, [filters.tab, filters.status]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading && !error) {
          fetchAppointments();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, isLoading, error, fetchAppointments]);

  const cancelTarget = cancelTargetId ? allAppointments.find((a) => a.id === cancelTargetId) : null;

  const handleCancelSuccess = () => {
    setCancelTargetId(null);
    setPage(1);
    setAllAppointments([]);
    fetchAppointments(true);
  };

  const handleReschedule = (id: string) => {
    navigate(`/patient/appointments/${id}/reschedule`);
  };

  const handleRetry = () => {
    setPage(1);
    setAllAppointments([]);
    fetchAppointments(true);
  };

  // Calculate stats
  const totalAppointments = allAppointments.length;
  const upcomingAppointments = allAppointments.filter(a => 
    new Date(a.scheduledAt) > new Date() && 
    a.status !== AppointmentStatus.CANCELLED &&
    a.status !== AppointmentStatus.COMPLETED
  ).length;
  const completedAppointments = allAppointments.filter(a => 
    a.status === AppointmentStatus.COMPLETED
  ).length;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .apt-history-wrap { animation: fadeIn 0.3s ease; }
        .apt-book-btn:hover { transform: translateY(-2px); filter: brightness(0.95); }
      `}</style>

      <div className="apt-history-wrap" style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
        
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
            <Shield size={18} color="#d97706" />
            <p style={{ fontSize: 12, fontWeight: 500, color: '#92400e', margin: 0 }}>
              Demo Mode: Showing sample appointments. Connect to backend for real data.
            </p>
          </div>
        )}

        {/* Welcome Banner */}
        <WelcomeBanner userName="Alex" />

        {/* Stats Cards */}
        <StatsCard total={totalAppointments} upcoming={upcomingAppointments} completed={completedAppointments} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              My Appointments
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              View and manage all your medical appointments
            </p>
          </div>
          <button
            className="apt-book-btn"
            onClick={() => navigate('/patient/appointments/book')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: 14,
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            <Plus size={16} />
            Book New
          </button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 20 }}>
          <AppointmentFilter
            filters={filters}
            onChange={(f) => setFilters(f)}
            totalCount={isLoading ? undefined : allAppointments.length}
          />
        </div>

        {/* Error banner */}
        {error && !isLoading && (
          <ErrorBanner message={error} isNetworkError={isNetworkError} onRetry={handleRetry} />
        )}

        {/* Appointment List */}
        <AppointmentHistoryList
          appointments={allAppointments}
          isLoading={isLoading}
          onCancel={(id) => setCancelTargetId(id)}
          onReschedule={handleReschedule}
          emptyMessage={
            error
              ? 'No appointments to show'
              : filters.tab === 'UPCOMING'
              ? 'No upcoming appointments'
              : filters.tab === 'PAST'
              ? 'No past appointments'
              : 'No appointments yet'
          }
          emptySubMessage={
            error
              ? 'Check your connection and retry above.'
              : filters.tab === 'UPCOMING'
              ? 'Book an appointment to get started with your health journey! 🚀'
              : 'Your appointment history will appear here as you complete visits.'
          }
        />

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} style={{ height: 40, marginTop: 8 }}>
          {isFetchingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  border: '3px solid #e5e7eb',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {cancelTarget && (
        <CancelAppointmentModal
          appointmentId={cancelTarget.id}
          doctorName={cancelTarget.doctorName}
          scheduledAt={cancelTarget.scheduledAt}
          onSuccess={handleCancelSuccess}
          onClose={() => setCancelTargetId(null)}
        />
      )}
    </>
  );
};

export { AppointmentsHistoryScreen };
export default AppointmentsHistoryScreen;