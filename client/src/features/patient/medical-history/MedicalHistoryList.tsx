// client/src/features/patient/medical-history/MedicalHistoryList.tsx

import React from 'react';
import { Activity, AlertCircle, Pill, Scissors, Syringe, Heart, FileX2, RefreshCw } from 'lucide-react';
import ConditionCard from './ConditionCard';
import AllergyCard from './AllergyCard';
import MedicationCard from './MedicationCard';
import SurgeryCard from './SurgeryCard';
import ImmunizationCard from './ImmunizationCard';
import VitalSignsCard from './VitalSignsCard';
import type { MedicalHistory } from '../../../types/patient/medical-history.types';

interface MedicalHistoryListProps {
  history: MedicalHistory;
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  onViewCondition: (id: string) => void;
  onViewAllergy: (id: string) => void;
  onViewMedication: (id: string) => void;
  onViewSurgery: (id: string) => void;
  onViewImmunization: (id: string) => void;
  onViewVitals: (id: string) => void;
  onEditCondition?: (id: string) => void;
  onEditAllergy?: (id: string) => void;
  onEditMedication?: (id: string) => void;
  onEditSurgery?: (id: string) => void;
  onDeleteCondition?: (id: string) => void;
  onDeleteAllergy?: (id: string) => void;
  onDeleteMedication?: (id: string) => void;
  onDeleteSurgery?: (id: string) => void;
  onRetry: () => void;
}

const tabConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  all: { icon: <Activity size={14} />, label: 'All Records', color: '#2563eb' },
  conditions: { icon: <Activity size={14} />, label: 'Conditions', color: '#2563eb' },
  allergies: { icon: <AlertCircle size={14} />, label: 'Allergies', color: '#dc2626' },
  medications: { icon: <Pill size={14} />, label: 'Medications', color: '#16a34a' },
  surgeries: { icon: <Scissors size={14} />, label: 'Surgeries', color: '#7c3aed' },
  immunizations: { icon: <Syringe size={14} />, label: 'Immunizations', color: '#d97706' },
  vitals: { icon: <Heart size={14} />, label: 'Vital Signs', color: '#0891b2' },
};

const SkeletonLoader: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ hasFilters: boolean; onClear: () => void }> = ({ hasFilters, onClear }) => (
  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <FileX2 size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {hasFilters ? 'No records found' : 'No medical records yet'}
    </h3>
    <p className="text-gray-500 mb-4">
      {hasFilters 
        ? 'Try adjusting your search or filters' 
        : 'Your medical history will appear here'}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear filters
      </button>
    )}
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
      <AlertCircle size={32} className="text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load records</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
    >
      <RefreshCw size={14} />
      Try Again
    </button>
  </div>
);

export const MedicalHistoryList: React.FC<MedicalHistoryListProps> = ({
  history,
  activeTab,
  isLoading,
  error,
  searchTerm,
  onViewCondition,
  onViewAllergy,
  onViewMedication,
  onViewSurgery,
  onViewImmunization,
  onViewVitals,
  onEditCondition,
  onEditAllergy,
  onEditMedication,
  onEditSurgery,
  onDeleteCondition,
  onDeleteAllergy,
  onDeleteMedication,
  onDeleteSurgery,
  onRetry,
}) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  const hasFilters = searchTerm.length > 0 || activeTab !== 'all';
  const hasAnyData = 
    history.conditions.length > 0 ||
    history.allergies.length > 0 ||
    history.medications.length > 0 ||
    history.surgeries.length > 0 ||
    history.immunizations.length > 0 ||
    history.vitalSigns.length > 0;

  if (!hasAnyData && !isLoading) {
    return <EmptyState hasFilters={hasFilters} onClear={onRetry} />;
  }

  const renderSection = (title: string, items: any[], type: string, onView: (id: string) => void, onEdit?: (id: string) => void, onDelete?: (id: string) => void, CardComponent: React.ComponentType<any>) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {tabConfig[type]?.icon}
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{items.length}</span>
        </div>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <CardComponent
              key={item.id}
              {...{ [type.slice(0, -1)]: item }}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              animationDelay={idx * 50}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {activeTab === 'all' || activeTab === 'conditions' ? renderSection('Conditions', history.conditions, 'conditions', onViewCondition, onEditCondition, onDeleteCondition, ConditionCard) : null}
      {activeTab === 'all' || activeTab === 'allergies' ? renderSection('Allergies', history.allergies, 'allergies', onViewAllergy, onEditAllergy, onDeleteAllergy, AllergyCard) : null}
      {activeTab === 'all' || activeTab === 'medications' ? renderSection('Medications', history.medications, 'medications', onViewMedication, onEditMedication, onDeleteMedication, MedicationCard) : null}
      {activeTab === 'all' || activeTab === 'surgeries' ? renderSection('Surgeries', history.surgeries, 'surgeries', onViewSurgery, onEditSurgery, onDeleteSurgery, SurgeryCard) : null}
      {activeTab === 'all' || activeTab === 'immunizations' ? renderSection('Immunizations', history.immunizations, 'immunizations', onViewImmunization, undefined, undefined, ImmunizationCard) : null}
      {activeTab === 'all' || activeTab === 'vitals' ? renderSection('Vital Signs', history.vitalSigns, 'vitals', onViewVitals, undefined, undefined, VitalSignsCard) : null}
    </div>
  );
};

export default MedicalHistoryList;