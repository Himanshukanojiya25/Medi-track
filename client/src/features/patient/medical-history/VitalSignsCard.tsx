// client/src/features/patient/medical-history/VitalSignsCard.tsx

import React from 'react';
import { Heart, Calendar, Activity, Thermometer, Weight, Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { VitalSigns } from '../../../types/patient/medical-history.types';

interface VitalSignsCardProps {
  vitals: VitalSigns;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  animationDelay?: number;
}

export const VitalSignsCard: React.FC<VitalSignsCardProps> = ({
  vitals,
  onView,
  onEdit,
  onDelete,
  animationDelay = 0,
}) => {
  // Safety check for undefined vitals
  if (!vitals) return null;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Safely access properties with fallbacks
  const recordedAt = vitals.recordedAt || vitals.createdAt || new Date().toISOString();
  const bloodPressure = vitals.bloodPressure || '—';
  const pulse = vitals.pulse || '—';
  const temperature = vitals.temperature || '—';
  const weight = vitals.weight || '—';
  const oxygenSaturation = vitals.oxygenSaturation || '—';
  const respiratoryRate = vitals.respiratoryRate || '—';
  const bmi = vitals.bmi || '—';
  const notes = vitals.notes || '';
  const recordedBy = vitals.recordedBy || 'Self';

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView(vitals.id)}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Heart size={16} className="text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Vital Signs Check</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {formatDate(recordedAt)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bloodPressure !== '—' && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <Activity size={14} className="mx-auto text-gray-500 mb-1" />
                <p className="text-xs text-gray-500">BP</p>
                <p className="text-sm font-semibold text-gray-900">{bloodPressure}</p>
              </div>
            )}
            {pulse !== '—' && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <Heart size={14} className="mx-auto text-gray-500 mb-1" />
                <p className="text-xs text-gray-500">Pulse</p>
                <p className="text-sm font-semibold text-gray-900">{pulse} bpm</p>
              </div>
            )}
            {temperature !== '—' && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <Thermometer size={14} className="mx-auto text-gray-500 mb-1" />
                <p className="text-xs text-gray-500">Temp</p>
                <p className="text-sm font-semibold text-gray-900">{temperature}°F</p>
              </div>
            )}
            {weight !== '—' && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <Weight size={14} className="mx-auto text-gray-500 mb-1" />
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-semibold text-gray-900">{weight} kg</p>
              </div>
            )}
          </div>

          {(oxygenSaturation !== '—' || respiratoryRate !== '—' || bmi !== '—') && (
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              {oxygenSaturation !== '—' && <span>SpO₂: {oxygenSaturation}%</span>}
              {respiratoryRate !== '—' && <span>Resp: {respiratoryRate}/min</span>}
              {bmi !== '—' && <span>BMI: {bmi}</span>}
            </div>
          )}

          {notes && (
            <div className="mt-2 text-xs text-gray-500 line-clamp-1">
              {notes}
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-400">
            Recorded by: {recordedBy}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(vitals.id); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={14} className="text-gray-500" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(vitals.id); }}
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

export default VitalSignsCard;