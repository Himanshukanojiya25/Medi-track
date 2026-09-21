// client/src/features/patient/medical-history/AddMedicalRecordModal.tsx

import React, { useState } from 'react';
import { X, Activity, AlertCircle, Pill, Scissors, Syringe, Heart, FileText } from 'lucide-react';
import MedicalHistoryForm from './MedicalHistoryForm';

interface AddMedicalRecordModalProps {
  type: string;
  onClose: () => void;
  onSuccess: () => void;
  isMockData?: boolean;
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  condition: { label: 'Medical Condition', icon: <Activity size={18} />, color: 'blue' },
  allergy: { label: 'Allergy', icon: <AlertCircle size={18} />, color: 'red' },
  medication: { label: 'Medication', icon: <Pill size={18} />, color: 'green' },
  surgery: { label: 'Surgery', icon: <Scissors size={18} />, color: 'purple' },
  immunization: { label: 'Immunization', icon: <Syringe size={18} />, color: 'amber' },
  vitals: { label: 'Vital Signs', icon: <Heart size={18} />, color: 'cyan' },
};

export const AddMedicalRecordModal: React.FC<AddMedicalRecordModalProps> = ({ 
  type, onClose, onSuccess, isMockData = true 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const config = typeConfig[type] || typeConfig.condition;

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      switch (type) {
        case 'condition':
          await medicalHistoryService.addCondition(data);
          break;
        case 'allergy':
          await medicalHistoryService.addAllergy(data);
          break;
        case 'medication':
          await medicalHistoryService.addMedication(data);
          break;
        case 'surgery':
          await medicalHistoryService.addSurgery(data);
          break;
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to add record:', error);
    }
    */
    
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <MedicalHistoryForm
        type={type}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddMedicalRecordModal;