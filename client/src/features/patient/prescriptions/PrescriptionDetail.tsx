// client/src/features/patient/prescriptions/PrescriptionDetail.tsx

import React from 'react';
import {
  Pill,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  FlaskConical,
  FileText,
  AlertCircle,
  CheckCircle2,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Shield,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import type { Prescription } from '../services/prescription.service';
import {
  PrescriptionStatus,
  FREQUENCY_LABELS,
  TIMING_LABELS,
  ROUTE_LABELS,
} from '../services/prescription.service';
import DownloadPrescriptionButton from './DownloadPrescriptionButton';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PrescriptionStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  [PrescriptionStatus.ACTIVE]: {
    label: 'Active',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: <CheckCircle2 size={14} />,
  },
  [PrescriptionStatus.COMPLETED]: {
    label: 'Completed',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: <CheckCircle2 size={14} />,
  },
  [PrescriptionStatus.EXPIRED]: {
    label: 'Expired',
    color: '#9ca3af',
    bg: '#f9fafb',
    border: '#e5e7eb',
    icon: <Clock size={14} />,
  },
  [PrescriptionStatus.CANCELLED]: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: <AlertCircle size={14} />,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}> = ({ title, icon, children, accent = '#2563eb' }) => (
  <div
    style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 18,
      overflow: 'hidden',
      marginBottom: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 20px',
        borderBottom: '1px solid #f3f4f6',
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: `${accent}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: '#1e293b',
          letterSpacing: '-0.1px',
          fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
        }}
      >
        {title}
      </h3>
    </div>
    <div style={{ padding: '6px 0' }}>{children}</div>
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}> = ({ label, value, icon, highlight = false }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '11px 20px',
      borderBottom: '1px solid #f8fafc',
      background: highlight ? 'linear-gradient(90deg, #fffbeb 0%, transparent 100%)' : 'transparent',
    }}
  >
    {icon && (
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
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
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 10.5,
          color: '#9ca3af',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          marginBottom: 3,
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 500,
          color: '#111827',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

// ─── Medication Row ───────────────────────────────────────────────────────────

const MedicationRow: React.FC<{
  med: Prescription['medications'][0];
  index: number;
}> = ({ med, index }) => (
  <div
    style={{
      padding: '14px 20px',
      borderBottom: '1px solid #f8fafc',
      animation: `rx-fade-in 0.4s ease both`,
      animationDelay: `${index * 60}ms`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 13,
      }}
    >
      {/* Med Number Badge */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 800,
          color: '#2563eb',
          fontFamily: "'DM Mono', 'Fira Code', monospace",
        }}
      >
        {index + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + Form */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 5,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: '#111827',
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
              letterSpacing: '-0.2px',
            }}
          >
            {med.name}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#2563eb',
              background: '#eff6ff',
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            {med.dosage}
          </span>
          <span
            style={{
              fontSize: 11,
              color: '#64748b',
              background: '#f1f5f9',
              padding: '2px 7px',
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {med.form}
          </span>
        </div>

        {/* Generic Name */}
        {med.genericName && (
          <p
            style={{
              fontSize: 11.5,
              color: '#94a3b8',
              marginBottom: 8,
              fontStyle: 'italic',
            }}
          >
            Generic: {med.genericName}
          </p>
        )}

        {/* Meta chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: med.instructions || med.sideEffects ? 10 : 0,
          }}
        >
          <MetaChip
            icon="⏰"
            label={FREQUENCY_LABELS[med.frequency]}
            color="#059669"
            bg="#ecfdf5"
          />
          <MetaChip
            icon="🍽️"
            label={TIMING_LABELS[med.timing]}
            color="#d97706"
            bg="#fffbeb"
          />
          <MetaChip
            icon="💊"
            label={ROUTE_LABELS[med.route]}
            color="#7c3aed"
            bg="#faf5ff"
          />
          <MetaChip
            icon="📅"
            label={`${med.durationDays} days`}
            color="#0369a1"
            bg="#f0f9ff"
          />
          {med.quantity != null && (
            <MetaChip
              icon="📦"
              label={`Qty: ${med.quantity}`}
              color="#475569"
              bg="#f8fafc"
            />
          )}
          {med.refillsAllowed != null && med.refillsAllowed > 0 && (
            <MetaChip
              icon="🔄"
              label={`${med.refillsAllowed} Refill${med.refillsAllowed > 1 ? 's' : ''}`}
              color="#0891b2"
              bg="#ecfeff"
            />
          )}
        </div>

        {/* Instructions */}
        {med.instructions && (
          <div
            style={{
              display: 'flex',
              gap: 7,
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 10,
              padding: '8px 11px',
              marginBottom: med.sideEffects?.length ? 8 : 0,
            }}
          >
            <span style={{ fontSize: 13, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5, fontWeight: 500 }}>
              {med.instructions}
            </p>
          </div>
        )}

        {/* Side effects */}
        {med.sideEffects && med.sideEffects.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 7,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '8px 11px',
            }}
          >
            <AlertCircle size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: '#dc2626',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}
              >
                Possible Side Effects
              </p>
              <p style={{ fontSize: 12, color: '#991b1b' }}>
                {med.sideEffects.join(' · ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const MetaChip: React.FC<{
  icon: string;
  label: string;
  color: string;
  bg: string;
}> = ({ icon, label, color, bg }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: bg,
      color,
      fontSize: 11.5,
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: 8,
    }}
  >
    <span style={{ fontSize: 11 }}>{icon}</span>
    {label}
  </span>
);

// ─── Vitals Grid ──────────────────────────────────────────────────────────────

const VitalsGrid: React.FC<{
  vitals: NonNullable<Prescription['vitalSigns']>;
}> = ({ vitals }) => {
  const items = [
    { icon: <Activity size={14} />, label: 'Blood Pressure', value: vitals.bloodPressure, color: '#dc2626', bg: '#fef2f2' },
    { icon: <Heart size={14} />,    label: 'Pulse',          value: vitals.pulse,          color: '#e11d48', bg: '#fff1f2' },
    { icon: <Thermometer size={14} />, label: 'Temperature', value: vitals.temperature,    color: '#d97706', bg: '#fffbeb' },
    { icon: <Weight size={14} />,   label: 'Weight',         value: vitals.weight,         color: '#7c3aed', bg: '#faf5ff' },
    { icon: <Shield size={14} />,   label: 'SpO2',           value: vitals.spo2,           color: '#2563eb', bg: '#eff6ff' },
    { icon: <Activity size={14} />, label: 'Height',         value: vitals.height,         color: '#059669', bg: '#ecfdf5' },
  ].filter((i) => i.value);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 10,
        padding: '14px 20px',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: item.bg,
            borderRadius: 12,
            padding: '10px 13px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `${item.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              margin: '0 auto 6px',
            }}
          >
            {item.icon}
          </div>
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 2,
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
            }}
          >
            {item.value}
          </p>
          <p style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 500 }}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface PrescriptionDetailProps {
  prescription: Prescription;
  isMockData?: boolean;
  onBookFollowUp?: (doctorId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrescriptionDetail: React.FC<PrescriptionDetailProps> = ({
  prescription: rx,
  isMockData = false,
  onBookFollowUp,
}) => {
  const cfg = STATUS_CONFIG[rx.status];

  const isActive = rx.status === PrescriptionStatus.ACTIVE;
  const daysRemaining = rx.validUntil
    ? Math.ceil((new Date(rx.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div style={{ animation: 'rx-fade-in 0.4s ease' }}>

      {/* ── Mock Banner ── */}
      {isMockData && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid #fbbf24',
            borderRadius: 14,
            padding: '11px 16px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Shield size={18} color="#d97706" />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>
              Demo Mode
            </p>
            <p style={{ fontSize: 11.5, color: '#78350f' }}>
              Showing sample prescription. Connect to backend for real data.
            </p>
          </div>
        </div>
      )}

      {/* ── Hero: RX Header ── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          padding: '22px 24px',
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: '#9ca3af',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Prescription ID
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#111827',
                fontFamily: "'DM Mono', 'Fira Code', monospace",
                letterSpacing: '0.5px',
              }}
            >
              {rx.id}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Days remaining pill */}
            {isActive && daysRemaining !== null && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: daysRemaining <= 3 ? '#fef2f2' : daysRemaining <= 7 ? '#fffbeb' : '#ecfdf5',
                  color: daysRemaining <= 3 ? '#dc2626' : daysRemaining <= 7 ? '#d97706' : '#059669',
                  border: `1px solid ${daysRemaining <= 3 ? '#fecaca' : daysRemaining <= 7 ? '#fde68a' : '#a7f3d0'}`,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '5px 11px',
                  borderRadius: 20,
                }}
              >
                <Clock size={12} />
                {daysRemaining <= 0 ? 'Expires today' : `${daysRemaining} days left`}
              </div>
            )}

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: cfg.bg,
                color: cfg.color,
                border: `1.5px solid ${cfg.border}`,
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 13px',
                borderRadius: 20,
              }}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Diagnosis */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
            borderRadius: 14,
            padding: '14px 18px',
            marginBottom: 18,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              color: '#0369a1',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            Diagnosis
          </p>
          <p
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0c4a6e',
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
              letterSpacing: '-0.3px',
              marginBottom: rx.secondaryDiagnosis ? 4 : 0,
            }}
          >
            {rx.diagnosis}
          </p>
          {rx.secondaryDiagnosis && (
            <p style={{ fontSize: 12.5, color: '#0369a1', fontWeight: 500 }}>
              + {rx.secondaryDiagnosis}
            </p>
          )}
        </div>

        {/* Doctor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            <Stethoscope size={20} color="#ffffff" />
          </div>
          <div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#111827',
                marginBottom: 2,
                fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
              }}
            >
              {rx.doctorName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, color: '#2563eb', fontWeight: 600 }}>
                {rx.doctorSpecialization}
              </span>
              {rx.doctorLicenseNumber && (
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  · Lic: {rx.doctorLicenseNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
            marginBottom: 14,
          }}
        >
          <Building2 size={13} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
              {rx.hospitalName}
            </p>
            {rx.hospitalAddress && (
              <p style={{ fontSize: 11.5, color: '#94a3b8' }}>{rx.hospitalAddress}</p>
            )}
          </div>
        </div>

        {/* Date bar */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            paddingTop: 14,
            borderTop: '1px dashed #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} color="#94a3b8" />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              Issued: <strong style={{ color: '#334155' }}>{formatDate(rx.issuedAt)}</strong>
            </span>
          </div>
          {rx.validUntil && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} color="#94a3b8" />
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                Valid till: <strong style={{ color: '#334155' }}>{formatDate(rx.validUntil)}</strong>
              </span>
            </div>
          )}
          {rx.followUpDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarCheck size={13} color="#059669" />
              <span style={{ fontSize: 12, color: '#064e3b', fontWeight: 600 }}>
                Follow-up: {formatDate(rx.followUpDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Medications ── */}
      <SectionCard
        title={`Medications (${rx.medications.length})`}
        icon={<Pill size={15} />}
        accent="#2563eb"
      >
        {rx.medications.map((med, i) => (
          <MedicationRow key={med.id} med={med} index={i} />
        ))}
      </SectionCard>

      {/* ── Lab Tests ── */}
      {rx.labTests && rx.labTests.length > 0 && (
        <SectionCard
          title={`Recommended Tests (${rx.labTests.length})`}
          icon={<FlaskConical size={15} />}
          accent="#7c3aed"
        >
          <div style={{ padding: '10px 20px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {rx.labTests.map((test, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#faf5ff',
                  border: '1px solid #e9d5ff',
                  color: '#6d28d9',
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: '5px 11px',
                  borderRadius: 9,
                }}
              >
                <FlaskConical size={11} />
                {test}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Vital Signs ── */}
      {rx.vitalSigns && Object.values(rx.vitalSigns).some(Boolean) && (
        <SectionCard title="Vital Signs at Visit" icon={<Activity size={15} />} accent="#dc2626">
          <VitalsGrid vitals={rx.vitalSigns} />
        </SectionCard>
      )}

      {/* ── Doctor Notes ── */}
      {rx.notes && (
        <SectionCard title="Doctor's Notes" icon={<FileText size={15} />} accent="#d97706">
          <div style={{ padding: '14px 20px' }}>
            <p
              style={{
                fontSize: 13.5,
                color: '#374151',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {rx.notes}
            </p>
          </div>
        </SectionCard>
      )}

      {/* ── Allergies Noted ── */}
      {rx.allergiesNoted && rx.allergiesNoted.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fecaca',
            borderRadius: 14,
            padding: '14px 18px',
            marginBottom: 16,
          }}
        >
          <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Known Allergies on Record
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {rx.allergiesNoted.map((a) => (
                <span
                  key={a}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fca5a5',
                    color: '#991b1b',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 8,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Action Bar ── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <DownloadPrescriptionButton
          prescriptionId={rx.id}
          variant="primary"
          size="md"
        />
        {rx.followUpDate && onBookFollowUp && (
          <button
            onClick={() => onBookFollowUp(rx.doctorId)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#f0fdf4',
              color: '#059669',
              border: '1.5px solid #a7f3d0',
              borderRadius: 10,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}
          >
            <CalendarCheck size={14} />
            Book Follow-up
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetail;