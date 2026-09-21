// client/src/features/patient/medical-history/SurgeryCard.tsx

import React from 'react';
import { Scissors, Calendar, Building2, User, Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { Surgery } from '../../../types/patient/medical-history.types';

interface SurgeryCardProps {
  surgery: Surgery;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

export const SurgeryCard: React.FC<SurgeryCardProps> = ({
  surgery,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  // Safety check for undefined surgery
  if (!surgery) return null;

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
      onClick={() => onView(surgery.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Scissors size={16} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{surgery.procedure || 'Unknown Procedure'}</h3>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(surgery.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {surgery.hospital || '—'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <span className="flex items-center gap-1">
                <User size={12} />
                Surgeon: {surgery.surgeon || '—'}
              </span>
              <span>•</span>
              <span>Anesthesia: {surgery.anesthesia || '—'}</span>
            </div>

            {surgery.indication && (
              <div className="text-gray-600 text-xs">
                <span className="font-medium">Indication:</span> {surgery.indication}
              </div>
            )}

            {surgery.complications && surgery.complications !== 'None' && (
              <div className="text-red-600 text-xs">
                <span className="font-medium">Complications:</span> {surgery.complications}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(surgery.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(surgery.id); }}
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

export default SurgeryCard;