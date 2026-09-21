// client/src/features/patient/prescriptions/PrescriptionCard.tsx

import React from 'react';
import {
  FileText,
  Pill,
  Calendar,
  Clock,
  Building2,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Stethoscope,
  FlaskConical,
  RefreshCw,
} from 'lucide-react';
import type { Prescription } from '../services/prescription.service';
import { PrescriptionStatus } from '../services/prescription.service';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PrescriptionStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    railColor: string;
  }
> = {
  [PrescriptionStatus.ACTIVE]: {
    label: 'Active',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: <CheckCircle2 size={12} />,
    railColor: '#10b981',
  },
  [PrescriptionStatus.COMPLETED]: {
    label: 'Completed',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: <CheckCircle2 size={12} />,
    railColor: '#3b82f6',
  },
  [PrescriptionStatus.EXPIRED]: {
    label: 'Expired',
    color: '#9ca3af',
    bg: '#f9fafb',
    border: '#e5e7eb',
    icon: <Clock size={12} />,
    railColor: '#9ca3af',
  },
  [PrescriptionStatus.CANCELLED]: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: <XCircle size={12} />,
    railColor: '#ef4444',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface PrescriptionCardProps {
  prescription: Prescription;
  onView: (id: string) => void;
  onDownload?: (id: string) => void;
  isDownloading?: boolean;
  animationDelay?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onView,
  onDownload,
  isDownloading = false,
  animationDelay = 0,
}) => {
  const cfg = STATUS_CONFIG[prescription.status];

  const isActive = prescription.status === PrescriptionStatus.ACTIVE;
  const daysRemaining = prescription.validUntil
    ? Math.max(
        0,
        Math.ceil(
          (new Date(prescription.validUntil).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const visibleMeds = prescription.medications.slice(0, 3);
  const extraMeds = prescription.medications.length - 3;

  return (
    <article
      onClick={() => onView(prescription.id)}
      style={{
        display: 'flex',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        animation: `rx-fade-in 0.4s ease both`,
        animationDelay: `${animationDelay}ms`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)';
        el.style.borderColor = '#bfdbfe';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)';
        el.style.borderColor = '#e5e7eb';
      }}
      aria-label={`Prescription ${prescription.id} — ${prescription.diagnosis}`}
    >
      {/* ── Colored Rail ── */}
      <div
        style={{
          width: 5,
          flexShrink: 0,
          background: cfg.railColor,
          borderRadius: '0 0 0 0',
        }}
      />

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '18px 20px', minWidth: 0 }}>

        {/* Row 1: RX ID + Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={15} color="#2563eb" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  marginBottom: 1,
                }}
              >
                Prescription
              </p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#374151',
                  fontFamily: "'DM Mono', 'Fira Code', monospace",
                  letterSpacing: '0.5px',
                }}
              >
                {prescription.id}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Validity Warning */}
            {isActive && daysRemaining !== null && daysRemaining <= 7 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#fffbeb',
                  color: '#b45309',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 20,
                  border: '1px solid #fde68a',
                }}
              >
                <AlertCircle size={11} />
                {daysRemaining === 0 ? 'Expires today' : `${daysRemaining}d left`}
              </div>
            )}

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: cfg.bg,
                color: cfg.color,
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                border: `1px solid ${cfg.border}`,
                letterSpacing: '0.2px',
              }}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Row 2: Diagnosis */}
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.3px',
              marginBottom: 4,
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {prescription.diagnosis}
          </p>
          {prescription.secondaryDiagnosis && (
            <p style={{ fontSize: 12, color: '#9ca3af' }}>
              + {prescription.secondaryDiagnosis}
            </p>
          )}
        </div>

        {/* Row 3: Doctor + Hospital */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 14,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Stethoscope size={12} color="#94a3b8" />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>
              {prescription.doctorName}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              · {prescription.doctorSpecialization}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Building2 size={12} color="#94a3b8" />
            <span
              style={{
                fontSize: 11.5,
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 180,
              }}
            >
              {prescription.hospitalName}
            </span>
          </div>
        </div>

        {/* Row 4: Medications chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 14,
          }}
        >
          {visibleMeds.map((med) => (
            <span
              key={med.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: 11.5,
                fontWeight: 600,
                padding: '4px 9px',
                borderRadius: 8,
              }}
            >
              <Pill size={10} color="#64748b" />
              {med.name}
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                {med.dosage}
              </span>
            </span>
          ))}
          {extraMeds > 0 && (
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: 8,
                border: '1px solid #bfdbfe',
              }}
            >
              +{extraMeds} more
            </span>
          )}
          {prescription.labTests && prescription.labTests.length > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                color: '#7c3aed',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 9px',
                borderRadius: 8,
              }}
            >
              <FlaskConical size={10} />
              {prescription.labTests.length} Lab Test
              {prescription.labTests.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Row 5: Dates + Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} color="#94a3b8" />
              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>
                {formatDate(prescription.issuedAt)}
              </span>
            </div>
            {prescription.validUntil && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <RefreshCw size={11} color="#94a3b8" />
                  <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>
                    Valid till {formatDate(prescription.validUntil)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {onDownload && (
              <button
                onClick={() => onDownload(prescription.id)}
                disabled={isDownloading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: isDownloading ? '#f1f5f9' : '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '6px 11px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: isDownloading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: isDownloading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDownloading)
                    e.currentTarget.style.background = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  if (!isDownloading)
                    e.currentTarget.style.background = '#f8fafc';
                }}
                aria-label="Download prescription"
              >
                {isDownloading ? (
                  <RefreshCw size={12} style={{ animation: 'rx-spin 1s linear infinite' }} />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2v8M5 7l3 3 3-3M3 13h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {isDownloading ? 'Downloading…' : 'PDF'}
              </button>
            )}

            <button
              onClick={() => onView(prescription.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 13px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              aria-label="View prescription details"
            >
              View
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PrescriptionCard;