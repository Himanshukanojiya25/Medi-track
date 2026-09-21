// client/src/features/patient/prescriptions/PrescriptionList.tsx

import React from 'react';
import { FileX2, RefreshCw, AlertCircle } from 'lucide-react';
import PrescriptionCard from './PrescriptionCard';
import type { Prescription } from '../services/prescription.service';

// ─── Skeleton ────────────────────────────────────────────────────────────────

const PrescriptionSkeleton: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <div
    style={{
      display: 'flex',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 20,
      overflow: 'hidden',
      animation: 'rx-fade-in 0.3s ease both',
      animationDelay: `${delay}ms`,
    }}
  >
    <div style={{ width: 5, background: '#e2e8f0', flexShrink: 0 }} />
    <div style={{ flex: 1, padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{ width: 32, height: 32, borderRadius: 10, ...shimmerStyle }}
          />
          <div>
            <div style={{ width: 80, height: 10, borderRadius: 4, ...shimmerStyle, marginBottom: 6 }} />
            <div style={{ width: 110, height: 14, borderRadius: 4, ...shimmerStyle }} />
          </div>
        </div>
        <div style={{ width: 64, height: 24, borderRadius: 20, ...shimmerStyle }} />
      </div>
      <div style={{ width: '55%', height: 18, borderRadius: 4, ...shimmerStyle, marginBottom: 10 }} />
      <div style={{ width: '80%', height: 12, borderRadius: 4, ...shimmerStyle, marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[90, 110, 80].map((w, i) => (
          <div key={i} style={{ width: w, height: 26, borderRadius: 8, ...shimmerStyle }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 160, height: 12, borderRadius: 4, ...shimmerStyle }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 64, height: 30, borderRadius: 8, ...shimmerStyle }} />
          <div style={{ width: 64, height: 30, borderRadius: 8, ...shimmerStyle }} />
        </div>
      </div>
    </div>
  </div>
);

const shimmerStyle: React.CSSProperties = {
  background:
    'linear-gradient(90deg, #f3f4f6 25%, #e9ecef 50%, #f3f4f6 75%)',
  backgroundSize: '200% 100%',
  animation: 'rx-shimmer 1.5s infinite',
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ hasFilters: boolean; onClear: () => void }> = ({
  hasFilters,
  onClear,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      background: '#ffffff',
      borderRadius: 20,
      border: '1px solid #e5e7eb',
      textAlign: 'center',
      animation: 'rx-fade-in 0.4s ease',
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}
    >
      <FileX2 size={34} color="#3b82f6" />
    </div>
    <h3
      style={{
        fontSize: 17,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 8,
        fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
        letterSpacing: '-0.2px',
      }}
    >
      {hasFilters ? 'No Prescriptions Found' : 'No Prescriptions Yet'}
    </h3>
    <p
      style={{
        fontSize: 13.5,
        color: '#6b7280',
        maxWidth: 320,
        lineHeight: 1.6,
        marginBottom: hasFilters ? 20 : 0,
      }}
    >
      {hasFilters
        ? 'No prescriptions match your current filters. Try adjusting your search or date range.'
        : 'Your prescriptions from doctors will appear here after your consultations.'}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: 10,
          padding: '9px 20px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
      >
        <RefreshCw size={13} />
        Clear Filters
      </button>
    )}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      borderRadius: 20,
      border: '1px solid #fecaca',
      textAlign: 'center',
      animation: 'rx-fade-in 0.4s ease',
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        boxShadow: '0 6px 16px rgba(220,38,38,0.25)',
      }}
    >
      <AlertCircle size={30} color="#ffffff" />
    </div>
    <h3
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 6,
        fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
      }}
    >
      Failed to Load Prescriptions
    </h3>
    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{message}</p>
    <button
      onClick={onRetry}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        padding: '9px 20px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#b91c1c')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#dc2626')}
    >
      <RefreshCw size={13} />
      Try Again
    </button>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface PrescriptionListProps {
  prescriptions: Prescription[];
  isLoading: boolean;
  error: string | null;
  hasFilters: boolean;
  downloadingId: string | null;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading,
  error,
  hasFilters,
  downloadingId,
  onView,
  onDownload,
  onClearFilters,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <PrescriptionSkeleton key={i} delay={i * 80} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (prescriptions.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClear={onClearFilters} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {prescriptions.map((rx, i) => (
        <PrescriptionCard
          key={rx.id}
          prescription={rx}
          onView={onView}
          onDownload={onDownload}
          isDownloading={downloadingId === rx.id}
          animationDelay={i * 60}
        />
      ))}
    </div>
  );
};

export default PrescriptionList;