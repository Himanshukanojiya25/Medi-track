// client/src/features/patient/medical-history/ImmunizationCard.tsx

import React from 'react';
import { Syringe, Calendar, Building2, Edit2, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Immunization } from '../../../types/patient/medical-history.types';

interface ImmunizationCardProps {
  immunization: Immunization;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

export const ImmunizationCard: React.FC<ImmunizationCardProps> = ({
  immunization,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  // Safety check for undefined immunization
  if (!immunization) return null;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpToDate = () => {
    if (!immunization.nextDueDate) return true;
    return new Date(immunization.nextDueDate) > new Date();
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView(immunization.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Syringe size={16} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{immunization.vaccine || 'Unknown Vaccine'}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Dose {immunization.dose || '1'}
            </span>
            {isUpToDate() && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                <CheckCircle2 size={10} />
                Up to Date
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Administered: {formatDate(immunization.date)}
              </span>
              {immunization.nextDueDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Next Due: {formatDate(immunization.nextDueDate)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-600 text-xs">
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {immunization.administeredBy || '—'}
              </span>
              {immunization.lotNumber && (
                <>
                  <span>•</span>
                  <span>Lot: {immunization.lotNumber}</span>
                </>
              )}
            </div>

            {immunization.notes && (
              <div className="text-gray-500 text-xs">
                {immunization.notes}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(immunization.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(immunization.id); }}
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

export default ImmunizationCard;