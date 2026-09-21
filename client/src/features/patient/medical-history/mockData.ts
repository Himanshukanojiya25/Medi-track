// client/src/features/patient/medical-history/mockData.ts

import type { 
  MedicalHistory, 
  MedicalCondition, 
  Allergy, 
  Medication, 
  Surgery,
  Immunization,
  VitalSigns 
} from '../../../types/patient/medical-history.types';

// ============================================================================
// MOCK CONDITIONS
// ============================================================================

export const MOCK_CONDITIONS: MedicalCondition[] = [
  {
    id: 'cond-001',
    patientId: 'PAT-001',
    name: 'Hypertension',
    diagnosedDate: '2022-03-15',
    status: 'ACTIVE',
    severity: 'MODERATE',
    symptoms: ['Headache', 'Dizziness', 'Blurred vision'],
    treatment: 'Lisinopril 10mg daily',
    notes: 'Monitor blood pressure weekly. Target BP < 130/80',
    createdAt: '2022-03-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'cond-002',
    patientId: 'PAT-001',
    name: 'Type 2 Diabetes',
    diagnosedDate: '2021-11-20',
    status: 'ACTIVE',
    severity: 'MILD',
    symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
    treatment: 'Metformin 500mg twice daily',
    notes: 'HbA1c target < 7%. Regular exercise recommended',
    createdAt: '2021-11-20T09:15:00Z',
    updatedAt: '2023-12-05T11:20:00Z',
  },
  {
    id: 'cond-003',
    patientId: 'PAT-001',
    name: 'Asthma',
    diagnosedDate: '2019-08-10',
    status: 'RESOLVED',
    severity: 'MILD',
    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness'],
    treatment: 'Inhaler as needed',
    notes: 'Symptoms resolved after treatment',
    resolvedDate: '2020-02-15',
    createdAt: '2019-08-10T14:00:00Z',
    updatedAt: '2020-02-15T16:30:00Z',
  },
];

// ============================================================================
// MOCK ALLERGIES
// ============================================================================

export const MOCK_ALLERGIES: Allergy[] = [
  {
    id: 'all-001',
    patientId: 'PAT-001',
    allergen: 'Penicillin',
    reaction: 'Hives, Swelling',
    severity: 'SEVERE',
    diagnosedDate: '2015-06-20',
    notes: 'Avoid all penicillin-class antibiotics',
    createdAt: '2015-06-20T08:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'all-002',
    patientId: 'PAT-001',
    allergen: 'Peanuts',
    reaction: 'Anaphylaxis',
    severity: 'SEVERE',
    diagnosedDate: '2010-03-10',
    notes: 'Carry epinephrine auto-injector at all times',
    createdAt: '2010-03-10T11:00:00Z',
    updatedAt: '2023-06-20T09:00:00Z',
  },
  {
    id: 'all-003',
    patientId: 'PAT-001',
    allergen: 'Dust Mites',
    reaction: 'Sneezing, Runny nose, Itchy eyes',
    severity: 'MILD',
    diagnosedDate: '2018-11-05',
    notes: 'Use allergen-proof bedding covers',
    createdAt: '2018-11-05T13:30:00Z',
    updatedAt: '2023-12-01T08:00:00Z',
  },
];

// ============================================================================
// MOCK MEDICATIONS
// ============================================================================

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med-001',
    patientId: 'PAT-001',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'ORAL',
    startDate: '2022-03-20',
    endDate: null,
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'Hypertension',
    instructions: 'Take with or without food. Do not crush.',
    sideEffects: ['Dry cough', 'Dizziness'],
    isActive: true,
    createdAt: '2022-03-20T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'med-002',
    patientId: 'PAT-001',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'ORAL',
    startDate: '2021-11-25',
    endDate: null,
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'Type 2 Diabetes',
    instructions: 'Take with meals to reduce GI upset',
    sideEffects: ['Nausea', 'Diarrhea'],
    isActive: true,
    createdAt: '2021-11-25T09:00:00Z',
    updatedAt: '2023-12-05T11:20:00Z',
  },
  {
    id: 'med-003',
    patientId: 'PAT-001',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    route: 'ORAL',
    startDate: '2023-01-15',
    endDate: null,
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'High cholesterol',
    instructions: 'Take in the evening',
    sideEffects: ['Muscle pain'],
    isActive: true,
    createdAt: '2023-01-15T14:00:00Z',
    updatedAt: '2023-12-05T11:20:00Z',
  },
];

// ============================================================================
// MOCK SURGERIES
// ============================================================================

export const MOCK_SURGERIES: Surgery[] = [
  {
    id: 'surg-001',
    patientId: 'PAT-001',
    procedure: 'Appendectomy',
    date: '2018-07-22',
    hospital: 'City General Hospital',
    surgeon: 'Dr. James Wilson',
    anesthesia: 'General',
    indication: 'Acute appendicitis',
    complications: 'None',
    notes: 'Laparoscopic procedure. Recovery uneventful.',
    createdAt: '2018-07-22T15:00:00Z',
    updatedAt: '2018-08-10T10:00:00Z',
  },
];

// ============================================================================
// MOCK IMMUNIZATIONS
// ============================================================================

export const MOCK_IMMUNIZATIONS: Immunization[] = [
  {
    id: 'imm-001',
    patientId: 'PAT-001',
    vaccine: 'COVID-19',
    dose: '2',
    date: '2021-04-15',
    administeredBy: 'City Health Center',
    lotNumber: 'CVD-12345',
    nextDueDate: '2022-04-15',
    notes: 'Moderna vaccine',
    createdAt: '2021-04-15T12:00:00Z',
    updatedAt: '2021-04-15T12:00:00Z',
  },
  {
    id: 'imm-002',
    patientId: 'PAT-001',
    vaccine: 'Influenza',
    dose: '1',
    date: '2023-10-10',
    administeredBy: 'MediCare Hospital',
    lotNumber: 'FLU-67890',
    nextDueDate: '2024-10-10',
    notes: 'Annual flu shot',
    createdAt: '2023-10-10T11:00:00Z',
    updatedAt: '2023-10-10T11:00:00Z',
  },
  {
    id: 'imm-003',
    patientId: 'PAT-001',
    vaccine: 'Tetanus',
    dose: '1',
    date: '2022-05-20',
    administeredBy: 'Emergency Clinic',
    lotNumber: 'TET-11223',
    nextDueDate: '2032-05-20',
    notes: 'Booster shot after injury',
    createdAt: '2022-05-20T16:00:00Z',
    updatedAt: '2022-05-20T16:00:00Z',
  },
];

// ============================================================================
// MOCK VITAL SIGNS
// ============================================================================

export const MOCK_VITALS: VitalSigns[] = [
  {
    id: 'vit-001',
    patientId: 'PAT-001',
    recordedAt: '2024-01-15T09:30:00Z',
    bloodPressure: '128/84',
    pulse: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 72.5,
    height: 170,
    bmi: 25.1,
    notes: 'Morning reading',
    recordedBy: 'Dr. Sarah Johnson',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'vit-002',
    patientId: 'PAT-001',
    recordedAt: '2023-12-10T14:00:00Z',
    bloodPressure: '132/86',
    pulse: 75,
    temperature: 98.4,
    respiratoryRate: 14,
    oxygenSaturation: 97,
    weight: 73.0,
    height: 170,
    bmi: 25.3,
    notes: 'Afternoon reading',
    recordedBy: 'Dr. Sarah Johnson',
    createdAt: '2023-12-10T14:00:00Z',
    updatedAt: '2023-12-10T14:00:00Z',
  },
];

// ============================================================================
// COMPLETE MEDICAL HISTORY
// ============================================================================

export const MOCK_MEDICAL_HISTORY: MedicalHistory = {
  conditions: MOCK_CONDITIONS,
  allergies: MOCK_ALLERGIES,
  medications: MOCK_MEDICATIONS,
  surgeries: MOCK_SURGERIES,
  immunizations: MOCK_IMMUNIZATIONS,
  vitalSigns: MOCK_VITALS,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const filterMedicalHistory = (
  history: MedicalHistory,
  searchTerm: string,
  typeFilter: string
): MedicalHistory => {
  const searchLower = searchTerm.toLowerCase();
  
  const filterBySearch = <T extends { name?: string; allergen?: string; procedure?: string; vaccine?: string }>(
    items: T[]
  ): T[] => {
    if (!searchTerm) return items;
    return items.filter(item => {
      const name = (item as any).name || (item as any).allergen || (item as any).procedure || (item as any).vaccine;
      return name?.toLowerCase().includes(searchLower);
    });
  };

  const filterByType = <T>(items: T[], type: string, currentType: string): T[] => {
    if (typeFilter === 'all' || typeFilter === currentType) return items;
    if (typeFilter === 'conditions' && currentType === 'conditions') return items;
    if (typeFilter === 'allergies' && currentType === 'allergies') return items;
    if (typeFilter === 'medications' && currentType === 'medications') return items;
    if (typeFilter === 'surgeries' && currentType === 'surgeries') return items;
    if (typeFilter === 'immunizations' && currentType === 'immunizations') return items;
    if (typeFilter === 'vitals' && currentType === 'vitals') return items;
    return [];
  };

  return {
    conditions: filterByType(filterBySearch(history.conditions), 'conditions', typeFilter),
    allergies: filterByType(filterBySearch(history.allergies), 'allergies', typeFilter),
    medications: filterByType(filterBySearch(history.medications), 'medications', typeFilter),
    surgeries: filterByType(filterBySearch(history.surgeries), 'surgeries', typeFilter),
    immunizations: filterByType(filterBySearch(history.immunizations), 'immunizations', typeFilter),
    vitalSigns: filterByType(filterBySearch(history.vitalSigns), 'vitals', typeFilter),
  };
};

export const getTotalRecords = (history: MedicalHistory): number => {
  return history.conditions.length +
    history.allergies.length +
    history.medications.length +
    history.surgeries.length +
    history.immunizations.length +
    history.vitalSigns.length;
};