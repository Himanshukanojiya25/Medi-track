// client/src/features/patient/hooks/useMedicalHistory.ts

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  treatedBy?: string;
}

export interface Allergy {
  id: string;
  name: string;
  type: 'food' | 'medication' | 'environmental' | 'other';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  reason?: string;
  isActive: boolean;
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital: string;
  surgeon?: string;
  notes?: string;
}

export interface MedicalHistoryFilters {
  type?: 'conditions' | 'allergies' | 'medications' | 'surgeries';
  search?: string;
  isActive?: boolean;
}

interface UseMedicalHistoryReturn {
  conditions: MedicalCondition[];
  allergies: Allergy[];
  medications: Medication[];
  surgeries: Surgery[];
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  error: string | null;
  filters: MedicalHistoryFilters;
  setFilters: (filters: MedicalHistoryFilters | ((prev: MedicalHistoryFilters) => MedicalHistoryFilters)) => void;
  addCondition: (condition: Omit<MedicalCondition, 'id'>) => Promise<MedicalCondition>;
  updateCondition: (id: string, data: Partial<MedicalCondition>) => Promise<MedicalCondition>;
  deleteCondition: (id: string) => Promise<void>;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => Promise<Allergy>;
  updateAllergy: (id: string, data: Partial<Allergy>) => Promise<Allergy>;
  deleteAllergy: (id: string) => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<Medication>;
  updateMedication: (id: string, data: Partial<Medication>) => Promise<Medication>;
  deleteMedication: (id: string) => Promise<void>;
  addSurgery: (surgery: Omit<Surgery, 'id'>) => Promise<Surgery>;
  updateSurgery: (id: string, data: Partial<Surgery>) => Promise<Surgery>;
  deleteSurgery: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockConditions: MedicalCondition[] = [
  {
    id: 'cond_1',
    name: 'Hypertension',
    diagnosedDate: '2023-01-15',
    status: 'active',
    severity: 'moderate',
    treatedBy: 'Dr. Sarah Johnson',
  },
];

const mockAllergies: Allergy[] = [
  {
    id: 'all_1',
    name: 'Penicillin',
    type: 'medication',
    reaction: 'Rash and difficulty breathing',
    severity: 'severe',
    diagnosedDate: '2020-03-10',
  },
];

const mockMedications: Medication[] = [
  {
    id: 'med_1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2023-01-20',
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'Hypertension',
    isActive: true,
  },
];

const mockSurgeries: Surgery[] = [];

const medicalHistoryService = {
  getMedicalHistory: async (filters?: MedicalHistoryFilters): Promise<{
    conditions: MedicalCondition[];
    allergies: Allergy[];
    medications: Medication[];
    surgeries: Surgery[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let conditions = [...mockConditions];
    let allergies = [...mockAllergies];
    let medications = [...mockMedications];
    let surgeries = [...mockSurgeries];
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      conditions = conditions.filter(c => c.name.toLowerCase().includes(searchLower));
      allergies = allergies.filter(a => a.name.toLowerCase().includes(searchLower));
      medications = medications.filter(m => m.name.toLowerCase().includes(searchLower));
      surgeries = surgeries.filter(s => s.name.toLowerCase().includes(searchLower));
    }
    
    if (filters?.isActive !== undefined) {
      medications = medications.filter(m => m.isActive === filters.isActive);
    }
    
    return { conditions, allergies, medications, surgeries };
  },
  
  addCondition: async (condition: Omit<MedicalCondition, 'id'>): Promise<MedicalCondition> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...condition, id: `cond_${Date.now()}` };
  },
  
  updateCondition: async (id: string, data: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockConditions.find(c => c.id === id);
    return { ...existing!, ...data, id };
  },
  
  deleteCondition: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  addAllergy: async (allergy: Omit<Allergy, 'id'>): Promise<Allergy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...allergy, id: `all_${Date.now()}` };
  },
  
  updateAllergy: async (id: string, data: Partial<Allergy>): Promise<Allergy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockAllergies.find(a => a.id === id);
    return { ...existing!, ...data, id };
  },
  
  deleteAllergy: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  addMedication: async (medication: Omit<Medication, 'id'>): Promise<Medication> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...medication, id: `med_${Date.now()}` };
  },
  
  updateMedication: async (id: string, data: Partial<Medication>): Promise<Medication> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockMedications.find(m => m.id === id);
    return { ...existing!, ...data, id };
  },
  
  deleteMedication: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  addSurgery: async (surgery: Omit<Surgery, 'id'>): Promise<Surgery> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...surgery, id: `surg_${Date.now()}` };
  },
  
  updateSurgery: async (id: string, data: Partial<Surgery>): Promise<Surgery> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockSurgeries.find(s => s.id === id);
    return { ...existing!, ...data, id };
  },
  
  deleteSurgery: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useMedicalHistory = (initialFilters?: MedicalHistoryFilters): UseMedicalHistoryReturn => {
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<MedicalHistoryFilters>(initialFilters || {});

  const clearError = useCallback(() => setError(null), []);
  const resetFilters = useCallback(() => setFiltersState({}), []);

  const fetchMedicalHistory = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await medicalHistoryService.getMedicalHistory(filters);
      setConditions(data.conditions);
      setAllergies(data.allergies);
      setMedications(data.medications);
      setSurgeries(data.surgeries);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch medical history';
      setError(errorMessage);
      console.error('[useMedicalHistory] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((
    newFilters: MedicalHistoryFilters | ((prev: MedicalHistoryFilters) => MedicalHistoryFilters)
  ): void => {
    setFiltersState(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return updated;
    });
  }, []);

  // Condition methods
  const addCondition = useCallback(async (condition: Omit<MedicalCondition, 'id'>): Promise<MedicalCondition> => {
    setIsAdding(true);
    setError(null);
    try {
      const newCondition = await medicalHistoryService.addCondition(condition);
      setConditions(prev => [...prev, newCondition]);
      return newCondition;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add condition';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateCondition = useCallback(async (id: string, data: Partial<MedicalCondition>): Promise<MedicalCondition> => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await medicalHistoryService.updateCondition(id, data);
      setConditions(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update condition';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteCondition = useCallback(async (id: string): Promise<void> => {
    setIsUpdating(true);
    setError(null);
    try {
      await medicalHistoryService.deleteCondition(id);
      setConditions(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete condition';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Allergy methods
  const addAllergy = useCallback(async (allergy: Omit<Allergy, 'id'>): Promise<Allergy> => {
    setIsAdding(true);
    setError(null);
    try {
      const newAllergy = await medicalHistoryService.addAllergy(allergy);
      setAllergies(prev => [...prev, newAllergy]);
      return newAllergy;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add allergy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateAllergy = useCallback(async (id: string, data: Partial<Allergy>): Promise<Allergy> => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await medicalHistoryService.updateAllergy(id, data);
      setAllergies(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update allergy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteAllergy = useCallback(async (id: string): Promise<void> => {
    setIsUpdating(true);
    setError(null);
    try {
      await medicalHistoryService.deleteAllergy(id);
      setAllergies(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete allergy';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Medication methods
  const addMedication = useCallback(async (medication: Omit<Medication, 'id'>): Promise<Medication> => {
    setIsAdding(true);
    setError(null);
    try {
      const newMedication = await medicalHistoryService.addMedication(medication);
      setMedications(prev => [...prev, newMedication]);
      return newMedication;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add medication';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateMedication = useCallback(async (id: string, data: Partial<Medication>): Promise<Medication> => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await medicalHistoryService.updateMedication(id, data);
      setMedications(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update medication';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteMedication = useCallback(async (id: string): Promise<void> => {
    setIsUpdating(true);
    setError(null);
    try {
      await medicalHistoryService.deleteMedication(id);
      setMedications(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete medication';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Surgery methods
  const addSurgery = useCallback(async (surgery: Omit<Surgery, 'id'>): Promise<Surgery> => {
    setIsAdding(true);
    setError(null);
    try {
      const newSurgery = await medicalHistoryService.addSurgery(surgery);
      setSurgeries(prev => [...prev, newSurgery]);
      return newSurgery;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add surgery';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const updateSurgery = useCallback(async (id: string, data: Partial<Surgery>): Promise<Surgery> => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await medicalHistoryService.updateSurgery(id, data);
      setSurgeries(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update surgery';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteSurgery = useCallback(async (id: string): Promise<void> => {
    setIsUpdating(true);
    setError(null);
    try {
      await medicalHistoryService.deleteSurgery(id);
      setSurgeries(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete surgery';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicalHistory();
  }, [filters, fetchMedicalHistory]);

  return {
    conditions,
    allergies,
    medications,
    surgeries,
    isLoading,
    isAdding,
    isUpdating,
    error,
    filters,
    setFilters,
    addCondition,
    updateCondition,
    deleteCondition,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    addMedication,
    updateMedication,
    deleteMedication,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    refetch: fetchMedicalHistory,
    clearError,
    resetFilters,
  };
};

export default useMedicalHistory;