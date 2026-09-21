// client/src/features/patient/medical-history/AllergyCard.tsx

import React from 'react';
import { AlertCircle, Calendar, Edit2, Trash2, ChevronRight, Shield } from 'lucide-react';
import type { Allergy } from '../../../types/patient/medical-history.types';

interface AllergyCardProps {
  allergy: Allergy;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
  MILD: { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
  MODERATE: { bg: '#fed7aa', text: '#ea580c', dot: '#f97316' },
  SEVERE: { bg: '#fecaca', text: '#dc2626', dot: '#ef4444' },
  LIFE_THREATENING: { bg: '#fecaca', text: '#b91c1c', dot: '#dc2626' },
};

export const AllergyCard: React.FC<AllergyCardProps> = ({
  allergy,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  // Safety check for undefined allergy
  if (!allergy) return null;

  const severity = severityColors[allergy.severity] || severityColors.MILD;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView(allergy.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle size={16} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{allergy.allergen || 'Unknown'}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: severity.bg, color: severity.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: severity.dot }} />
              {allergy.severity || 'MILD'}
            </span>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Diagnosed: {formatDate(allergy.diagnosedDate)}
              </span>
            </div>

            <div className="flex items-start gap-1 text-gray-600">
              <span className="font-medium">Reaction:</span>
              <span>{allergy.reaction || '—'}</span>
            </div>

            {allergy.notes && (
              <div className="flex items-start gap-1 text-gray-500 text-xs">
                <Shield size={12} className="flex-shrink-0 mt-0.5" />
                <span>{allergy.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(allergy.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(allergy.id); }}
              className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          )}
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default AllergyCard;