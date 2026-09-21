// client/src/features/patient/medical-history/MedicalHistoryDetail.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Edit2, Trash2, Shield, AlertCircle, 
  Activity, Pill, Scissors, Syringe, Heart, Clock, User,
  Building2, FileText, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import type { 
  MedicalCondition, Allergy, Medication, Surgery, 
  Immunization, VitalSigns 
} from '../../../types/patient/medical-history.types';
import { 
  MOCK_CONDITIONS, MOCK_ALLERGIES, MOCK_MEDICATIONS, 
  MOCK_SURGERIES, MOCK_IMMUNIZATIONS, MOCK_VITALS 
} from './mockData';

interface MedicalHistoryDetailProps {
  recordId: string;
  recordType: string;
  onBack: () => void;
  isMockData?: boolean;
}

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  MILD: { label: 'Mild', color: '#d97706', bg: '#fef3c7' },
  MODERATE: { label: 'Moderate', color: '#ea580c', bg: '#fed7aa' },
  SEVERE: { label: 'Severe', color: '#dc2626', bg: '#fecaca' },
  CRITICAL: { label: 'Critical', color: '#b91c1c', bg: '#fecaca' },
  LIFE_THREATENING: { label: 'Life Threatening', color: '#b91c1c', bg: '#fecaca' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Active', color: '#16a34a', bg: '#dcfce7' },
  RESOLVED: { label: 'Resolved', color: '#64748b', bg: '#f1f5f9' },
  IN_REMISSION: { label: 'In Remission', color: '#2563eb', bg: '#dbeafe' },
};

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ReactNode }> = ({ 
  label, value, icon 
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    {icon && <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">{icon}</div>}
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ 
  title, icon, children 
}) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <span className="text-blue-600">{icon}</span>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse">
    <div className="h-8 w-24 bg-gray-200 rounded mb-6" />
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

export const MedicalHistoryDetail: React.FC<MedicalHistoryDetailProps> = ({ 
  recordId, recordType, onBack, isMockData = true 
}) => {
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let foundRecord = null;
      
      switch (recordType) {
        case 'condition':
          foundRecord = MOCK_CONDITIONS.find(c => c.id === recordId);
          break;
        case 'allergy':
          foundRecord = MOCK_ALLERGIES.find(a => a.id === recordId);
          break;
        case 'medication':
          foundRecord = MOCK_MEDICATIONS.find(m => m.id === recordId);
          break;
        case 'surgery':
          foundRecord = MOCK_SURGERIES.find(s => s.id === recordId);
          break;
        case 'immunization':
          foundRecord = MOCK_IMMUNIZATIONS.find(i => i.id === recordId);
          break;
        case 'vitals':
          foundRecord = MOCK_VITALS.find(v => v.id === recordId);
          break;
      }
      
      setRecord(foundRecord);
      setIsLoading(false);
    }, 300);
  }, [recordId, recordType]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) return <SkeletonLoader />;
  if (!record) return null;

  const renderConditionDetail = () => {
    const cond = record as MedicalCondition;
    const severity = severityConfig[cond.severity] || severityConfig.MILD;
    const status = statusConfig[cond.status] || statusConfig.ACTIVE;

    return (
      <>
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity size={28} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{cond.name}</h1>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium`} style={{ background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium`} style={{ background: severity.bg, color: severity.color }}>
                    {severity.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit2 size={16} className="text-gray-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>

          <InfoRow icon={<Calendar size={16} />} label="Diagnosed Date" value={formatDate(cond.diagnosedDate)} />
          {cond.resolvedDate && <InfoRow icon={<CheckCircle2 size={16} />} label="Resolved Date" value={formatDate(cond.resolvedDate)} />}
          {cond.treatment && <InfoRow icon={<Pill size={16} />} label="Treatment" value={cond.treatment} />}
          {cond.symptoms?.length > 0 && <InfoRow icon={<AlertCircle size={16} />} label="Symptoms" value={cond.symptoms.join(', ')} />}
          {cond.notes && <InfoRow icon={<FileText size={16} />} label="Notes" value={cond.notes} />}
        </div>
      </>
    );
  };

  const renderAllergyDetail = () => {
    const allergy = record as Allergy;
    const severity = severityConfig[allergy.severity] || severityConfig.MILD;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={28} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{allergy.allergen}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block`} style={{ background: severity.bg, color: severity.color }}>
                {severity.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} className="text-gray-500" /></button>
            <button className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        </div>
        <InfoRow icon={<Calendar size={16} />} label="Diagnosed Date" value={formatDate(allergy.diagnosedDate)} />
        <InfoRow icon={<AlertTriangle size={16} />} label="Reaction" value={allergy.reaction} />
        {allergy.notes && <InfoRow icon={<FileText size={16} />} label="Notes" value={allergy.notes} />}
      </div>
    );
  };

  const renderMedicationDetail = () => {
    const med = record as Medication;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Pill size={28} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{med.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block ${med.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {med.isActive ? 'Active' : 'Discontinued'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} className="text-gray-500" /></button>
            <button className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        </div>
        <InfoRow icon={<Pill size={16} />} label="Dosage & Frequency" value={`${med.dosage} - ${med.frequency}`} />
        <InfoRow icon={<Clock size={16} />} label="Route" value={med.route} />
        <InfoRow icon={<Calendar size={16} />} label="Start Date" value={formatDate(med.startDate)} />
        {med.endDate && <InfoRow icon={<XCircle size={16} />} label="End Date" value={formatDate(med.endDate)} />}
        {med.prescribedBy && <InfoRow icon={<User size={16} />} label="Prescribed By" value={med.prescribedBy} />}
        {med.reason && <InfoRow icon={<FileText size={16} />} label="Reason" value={med.reason} />}
        {med.instructions && <InfoRow icon={<FileText size={16} />} label="Instructions" value={med.instructions} />}
        {med.sideEffects?.length > 0 && <InfoRow icon={<AlertCircle size={16} />} label="Side Effects" value={med.sideEffects.join(', ')} />}
      </div>
    );
  };

  const renderSurgeryDetail = () => {
    const surgery = record as Surgery;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              <Scissors size={28} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{surgery.procedure}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} className="text-gray-500" /></button>
            <button className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        </div>
        <InfoRow icon={<Calendar size={16} />} label="Date" value={formatDate(surgery.date)} />
        <InfoRow icon={<Building2 size={16} />} label="Hospital" value={surgery.hospital} />
        <InfoRow icon={<User size={16} />} label="Surgeon" value={surgery.surgeon} />
        <InfoRow icon={<AlertCircle size={16} />} label="Anesthesia" value={surgery.anesthesia} />
        {surgery.indication && <InfoRow icon={<FileText size={16} />} label="Indication" value={surgery.indication} />}
        {surgery.complications && surgery.complications !== 'None' && <InfoRow icon={<AlertTriangle size={16} />} label="Complications" value={surgery.complications} />}
        {surgery.notes && <InfoRow icon={<FileText size={16} />} label="Notes" value={surgery.notes} />}
      </div>
    );
  };

  const renderImmunizationDetail = () => {
    const imm = record as Immunization;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <Syringe size={28} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{imm.vaccine}</h1>
              <p className="text-sm text-gray-500">Dose {imm.dose}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} className="text-gray-500" /></button>
            <button className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        </div>
        <InfoRow icon={<Calendar size={16} />} label="Date Administered" value={formatDate(imm.date)} />
        <InfoRow icon={<Building2 size={16} />} label="Administered By" value={imm.administeredBy} />
        {imm.lotNumber && <InfoRow icon={<FileText size={16} />} label="Lot Number" value={imm.lotNumber} />}
        {imm.nextDueDate && <InfoRow icon={<Calendar size={16} />} label="Next Due Date" value={formatDate(imm.nextDueDate)} />}
        {imm.notes && <InfoRow icon={<FileText size={16} />} label="Notes" value={imm.notes} />}
      </div>
    );
  };

  const renderVitalsDetail = () => {
    const vitals = record as VitalSigns;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center">
              <Heart size={28} className="text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vital Signs</h1>
              <p className="text-sm text-gray-500">{formatDate(vitals.recordedAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 size={16} className="text-gray-500" /></button>
            <button className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {vitals.bloodPressure && <InfoRow icon={<Activity size={16} />} label="Blood Pressure" value={vitals.bloodPressure} />}
          {vitals.pulse && <InfoRow icon={<Heart size={16} />} label="Pulse" value={`${vitals.pulse} bpm`} />}
          {vitals.temperature && <InfoRow icon={<Thermometer size={16} />} label="Temperature" value={`${vitals.temperature}°F`} />}
          {vitals.respiratoryRate && <InfoRow icon={<Activity size={16} />} label="Respiratory Rate" value={`${vitals.respiratoryRate} /min`} />}
          {vitals.oxygenSaturation && <InfoRow icon={<Activity size={16} />} label="O2 Saturation" value={`${vitals.oxygenSaturation}%`} />}
          {vitals.weight && <InfoRow icon={<Activity size={16} />} label="Weight" value={`${vitals.weight} kg`} />}
          {vitals.height && <InfoRow icon={<Activity size={16} />} label="Height" value={`${vitals.height} cm`} />}
          {vitals.bmi && <InfoRow icon={<Activity size={16} />} label="BMI" value={vitals.bmi} />}
        </div>
        {vitals.notes && <InfoRow icon={<FileText size={16} />} label="Notes" value={vitals.notes} />}
        {vitals.recordedBy && <InfoRow icon={<User size={16} />} label="Recorded By" value={vitals.recordedBy} />}
      </div>
    );
  };

  const renderDetail = () => {
    switch (recordType) {
      case 'condition': return renderConditionDetail();
      case 'allergy': return renderAllergyDetail();
      case 'medication': return renderMedicationDetail();
      case 'surgery': return renderSurgeryDetail();
      case 'immunization': return renderImmunizationDetail();
      case 'vitals': return renderVitalsDetail();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {isMockData && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Shield size={18} className="text-amber-600" />
            <p className="text-sm text-amber-700 flex-1">Demo Mode: Showing sample record details.</p>
          </div>
        )}

        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={20} /> Back to Medical History
        </button>

        {renderDetail()}
      </div>
    </div>
  );
};

export default MedicalHistoryDetail;