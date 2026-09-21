// client/src/features/patient/medical-history/MedicationCard.tsx

import React from 'react';
import { Pill, Calendar, Clock, Edit2, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import type { Medication } from '../../../types/patient/medical-history.types';

interface MedicationCardProps {
  medication: Medication;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView(medication.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Pill size={16} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{medication.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: medication.isActive ? '#dcfce7' : '#e2e8f0', color: medication.isActive ? '#16a34a' : '#64748b' }}>
              {medication.isActive ? 'Active' : 'Discontinued'}
            </span>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="font-medium">{medication.dosage}</span>
              <span>•</span>
              <span>{medication.frequency}</span>
              <span>•</span>
              <span>{medication.route}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Started: {formatDate(medication.startDate)}
              </span>
              {medication.endDate && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Ended: {formatDate(medication.endDate)}
                </span>
              )}
            </div>

            {medication.instructions && (
              <div className="text-gray-600 text-xs">
                <span className="font-medium">Instructions:</span> {medication.instructions}
              </div>
            )}

            {medication.sideEffects && medication.sideEffects.length > 0 && (
              <div className="flex items-center gap-1 text-orange-600 text-xs">
                <AlertCircle size={12} />
                <span>Side effects: {medication.sideEffects.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(medication.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(medication.id); }}
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

export default MedicationCard;