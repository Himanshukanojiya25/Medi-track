// client/src/features/patient/medical-history/EditMedicalRecordModal.tsx

import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import MedicalHistoryForm from './MedicalHistoryForm';
import { medicalHistoryService } from '../services/medical-history.service';
import { 
  MOCK_CONDITIONS, MOCK_ALLERGIES, MOCK_MEDICATIONS, MOCK_SURGERIES 
} from './mockData';

interface EditMedicalRecordModalProps {
  type: string;
  recordId: string;
  onClose: () => void;
  onSuccess: () => void;
  isMockData?: boolean;
}

export const EditMedicalRecordModal: React.FC<EditMedicalRecordModalProps> = ({ 
  type, recordId, onClose, onSuccess, isMockData = true 
}) => {
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      let foundRecord = null;
      switch (type) {
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
      }
      setRecord(foundRecord);
      setIsLoading(false);
    }, 300);
  }, [type, recordId]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      switch (type) {
        case 'condition':
          await medicalHistoryService.updateCondition(recordId, data);
          break;
        case 'allergy':
          await medicalHistoryService.updateAllergy(recordId, data);
          break;
        case 'medication':
          await medicalHistoryService.updateMedication(recordId, data);
          break;
        case 'surgery':
          await medicalHistoryService.updateSurgery(recordId, data);
          break;
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to update record:', error);
    }
    */
    
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-96 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading record...</p>
        </div>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Edit2 size={18} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Edit Record</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
        </div>
        
        {isMockData && (
          <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <p className="text-xs text-amber-700 flex-1">Demo Mode: Changes are saved locally.</p>
          </div>
        )}
        
        <MedicalHistoryForm
          type={type}
          initialData={record}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditMedicalRecordModal;