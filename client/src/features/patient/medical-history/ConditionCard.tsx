// client/src/features/patient/medical-history/ConditionCard.tsx

import React from 'react';
import { Activity, Calendar, AlertTriangle, Clock, Edit2, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { MedicalCondition } from '../../../types/patient/medical-history.types';

interface ConditionCardProps {
  condition: MedicalCondition;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
  MILD: { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
  MODERATE: { bg: '#fed7aa', text: '#ea580c', dot: '#f97316' },
  SEVERE: { bg: '#fecaca', text: '#dc2626', dot: '#ef4444' },
  CRITICAL: { bg: '#fecaca', text: '#b91c1c', dot: '#dc2626' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: '#dcfce7', text: '#16a34a' },
  RESOLVED: { bg: '#e2e8f0', text: '#64748b' },
  IN_REMISSION: { bg: '#dbeafe', text: '#2563eb' },
};

export const ConditionCard: React.FC<ConditionCardProps> = ({
  condition,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  // Safety checks for undefined condition
  if (!condition) return null;

  const severity = severityColors[condition.severity] || severityColors.MILD;
  const status = statusColors[condition.status] || statusColors.ACTIVE;

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
      onClick={() => onView(condition.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity size={16} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{condition.name || 'Unknown'}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: status.bg, color: status.text }}>
              {condition.status || 'ACTIVE'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: severity.bg, color: severity.text }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: severity.dot }} />
              {condition.severity || 'MILD'}
            </span>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Diagnosed: {formatDate(condition.diagnosedDate)}
              </span>
              {condition.resolvedDate && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Resolved: {formatDate(condition.resolvedDate)}
                </span>
              )}
            </div>

            {condition.treatment && (
              <div className="flex items-start gap-1 text-gray-600">
                <span className="font-medium">Treatment:</span>
                <span>{condition.treatment}</span>
              </div>
            )}

            {condition.symptoms && condition.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {condition.symptoms.slice(0, 3).map(symptom => (
                  <span key={symptom} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {symptom}
                  </span>
                ))}
                {condition.symptoms.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{condition.symptoms.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(condition.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(condition.id); }}
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

export default ConditionCard;