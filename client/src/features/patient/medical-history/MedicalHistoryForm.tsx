// client/src/features/patient/medical-history/MedicalHistoryForm.tsx

import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Pill, Scissors, Syringe, Heart, Activity, FileText } from 'lucide-react';

interface MedicalHistoryFormProps {
  type: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const severityOptions = [
  { value: 'MILD', label: 'Mild' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'SEVERE', label: 'Severe' },
  { value: 'CRITICAL', label: 'Critical' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'IN_REMISSION', label: 'In Remission' },
];

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  type,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // ─── Condition Form ─────────────────────────────────────────────────────────
  const renderConditionForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Condition Name *</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          placeholder="e.g., Hypertension, Diabetes"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Diagnosed Date *</label>
          <input
            type="date"
            value={formData.diagnosedDate || ''}
            onChange={(e) => handleChange('diagnosedDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
          <select
            value={formData.status || 'ACTIVE'}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ color: '#111827' }}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Severity</label>
          <select
            value={formData.severity || 'MILD'}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          >
            {severityOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ color: '#111827' }}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Resolved Date</label>
          <input
            type="date"
            value={formData.resolvedDate || ''}
            onChange={(e) => handleChange('resolvedDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Treatment</label>
        <textarea
          value={formData.treatment || ''}
          onChange={(e) => handleChange('treatment', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Lisinopril 10mg daily"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Symptoms (comma separated)</label>
        <input
          type="text"
          value={formData.symptoms?.join(', ') || ''}
          onChange={(e) => handleChange('symptoms', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Headache, Dizziness, Fatigue"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );

  // ─── Allergy Form ───────────────────────────────────────────────────────────
  const renderAllergyForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Allergen *</label>
        <input
          type="text"
          value={formData.allergen || ''}
          onChange={(e) => handleChange('allergen', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Penicillin, Peanuts, Dust"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Diagnosed Date</label>
          <input
            type="date"
            value={formData.diagnosedDate || ''}
            onChange={(e) => handleChange('diagnosedDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Severity</label>
          <select
            value={formData.severity || 'MILD'}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          >
            {severityOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ color: '#111827' }}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Reaction *</label>
        <textarea
          value={formData.reaction || ''}
          onChange={(e) => handleChange('reaction', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Hives, Swelling, Anaphylaxis"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );

  // ─── Medication Form ────────────────────────────────────────────────────────
  const renderMedicationForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Medication Name *</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Lisinopril, Metformin"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Dosage</label>
          <input
            type="text"
            value={formData.dosage || ''}
            onChange={(e) => handleChange('dosage', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            placeholder="e.g., 10mg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Frequency</label>
          <input
            type="text"
            value={formData.frequency || ''}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            placeholder="e.g., Once daily, Twice daily"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Prescribed By</label>
        <input
          type="text"
          value={formData.prescribedBy || ''}
          onChange={(e) => handleChange('prescribedBy', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Doctor's name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Reason</label>
        <input
          type="text"
          value={formData.reason || ''}
          onChange={(e) => handleChange('reason', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Why is this medication prescribed?"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Instructions</label>
        <textarea
          value={formData.instructions || ''}
          onChange={(e) => handleChange('instructions', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Take with food, Do not crush"
        />
      </div>
    </div>
  );

  // ─── Surgery Form ───────────────────────────────────────────────────────────
  const renderSurgeryForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Procedure Name *</label>
        <input
          type="text"
          value={formData.procedure || ''}
          onChange={(e) => handleChange('procedure', e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="e.g., Appendectomy, Knee Replacement"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Date *</label>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Hospital</label>
          <input
            type="text"
            value={formData.hospital || ''}
            onChange={(e) => handleChange('hospital', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            placeholder="Hospital name"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Surgeon</label>
          <input
            type="text"
            value={formData.surgeon || ''}
            onChange={(e) => handleChange('surgeon', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            placeholder="Surgeon's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Anesthesia</label>
          <input
            type="text"
            value={formData.anesthesia || ''}
            onChange={(e) => handleChange('anesthesia', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
            placeholder="e.g., General, Local"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Indication</label>
        <textarea
          value={formData.indication || ''}
          onChange={(e) => handleChange('indication', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Reason for surgery"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={2}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'condition': return 'Add Medical Condition';
      case 'allergy': return 'Add Allergy';
      case 'medication': return 'Add Medication';
      case 'surgery': return 'Add Surgery Record';
      case 'immunization': return 'Add Immunization';
      case 'vitals': return 'Add Vital Signs';
      default: return 'Add Medical Record';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'condition': return <Activity size={20} />;
      case 'allergy': return <AlertCircle size={20} />;
      case 'medication': return <Pill size={20} />;
      case 'surgery': return <Scissors size={20} />;
      case 'immunization': return <Syringe size={20} />;
      case 'vitals': return <Heart size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'condition': return renderConditionForm();
      case 'allergy': return renderAllergyForm();
      case 'medication': return renderMedicationForm();
      case 'surgery': return renderSurgeryForm();
      default: return (
        <div className="text-center py-8 text-gray-500">
          Form type "{type}" is not supported yet.
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            {getIcon()}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5">
        {renderForm()}
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalHistoryForm;