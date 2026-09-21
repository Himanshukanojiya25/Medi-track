// client/src/features/patient/prescriptions/prescription.service.ts

import apiClient from '../../../lib/api/http.client';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum PrescriptionStatus {
  ACTIVE    = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED   = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum MedicationFrequency {
  ONCE_DAILY      = 'ONCE_DAILY',
  TWICE_DAILY     = 'TWICE_DAILY',
  THRICE_DAILY    = 'THRICE_DAILY',
  FOUR_TIMES      = 'FOUR_TIMES',
  AS_NEEDED       = 'AS_NEEDED',
  WEEKLY          = 'WEEKLY',
  ALTERNATE_DAYS  = 'ALTERNATE_DAYS',
}

export enum MedicationTiming {
  BEFORE_FOOD  = 'BEFORE_FOOD',
  AFTER_FOOD   = 'AFTER_FOOD',
  WITH_FOOD    = 'WITH_FOOD',
  EMPTY_STOMACH = 'EMPTY_STOMACH',
  BEDTIME      = 'BEDTIME',
  ANYTIME      = 'ANYTIME',
}

export enum MedicationRoute {
  ORAL       = 'ORAL',
  TOPICAL    = 'TOPICAL',
  INHALATION = 'INHALATION',
  INJECTION  = 'INJECTION',
  SUBLINGUAL = 'SUBLINGUAL',
  EYE_DROPS  = 'EYE_DROPS',
  EAR_DROPS  = 'EAR_DROPS',
  NASAL      = 'NASAL',
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: string;               // Tablet, Capsule, Syrup, Cream, etc.
  frequency: MedicationFrequency;
  timing: MedicationTiming;
  route: MedicationRoute;
  durationDays: number;
  quantity?: number;
  refillsAllowed?: number;
  instructions?: string;
  sideEffects?: string[];
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorProfilePicture?: string;
  doctorLicenseNumber?: string;
  hospitalName: string;
  hospitalAddress?: string;
  diagnosis: string;
  secondaryDiagnosis?: string;
  medications: Medication[];
  labTests?: string[];
  status: PrescriptionStatus;
  issuedAt: string;
  validUntil?: string;
  followUpDate?: string;
  notes?: string;
  allergiesNoted?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    weight?: string;
    height?: string;
    spo2?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionFilters {
  status?: PrescriptionStatus | 'ALL';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  page?: number;
  limit?: number;
}

export interface PrescriptionListResponse {
  data: Prescription[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Frequency / Timing Labels ────────────────────────────────────────────────

export const FREQUENCY_LABELS: Record<MedicationFrequency, string> = {
  [MedicationFrequency.ONCE_DAILY]:     '1× Daily',
  [MedicationFrequency.TWICE_DAILY]:    '2× Daily',
  [MedicationFrequency.THRICE_DAILY]:   '3× Daily',
  [MedicationFrequency.FOUR_TIMES]:     '4× Daily',
  [MedicationFrequency.AS_NEEDED]:      'As Needed',
  [MedicationFrequency.WEEKLY]:         'Weekly',
  [MedicationFrequency.ALTERNATE_DAYS]: 'Alternate Days',
};

export const TIMING_LABELS: Record<MedicationTiming, string> = {
  [MedicationTiming.BEFORE_FOOD]:    'Before Food',
  [MedicationTiming.AFTER_FOOD]:     'After Food',
  [MedicationTiming.WITH_FOOD]:      'With Food',
  [MedicationTiming.EMPTY_STOMACH]:  'Empty Stomach',
  [MedicationTiming.BEDTIME]:        'At Bedtime',
  [MedicationTiming.ANYTIME]:        'Any Time',
};

export const ROUTE_LABELS: Record<MedicationRoute, string> = {
  [MedicationRoute.ORAL]:       'Oral',
  [MedicationRoute.TOPICAL]:    'Topical',
  [MedicationRoute.INHALATION]: 'Inhalation',
  [MedicationRoute.INJECTION]:  'Injection',
  [MedicationRoute.SUBLINGUAL]: 'Sublingual',
  [MedicationRoute.EYE_DROPS]:  'Eye Drops',
  [MedicationRoute.EAR_DROPS]:  'Ear Drops',
  [MedicationRoute.NASAL]:      'Nasal',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2024-001',
    patientId: 'PAT-001',
    doctorId: 'DOC-001',
    appointmentId: 'APT-003',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiologist',
    doctorLicenseNumber: 'MCI-2024-KA-10432',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '12, MG Road, Bengaluru, Karnataka - 560001',
    diagnosis: 'Hypertension Stage 1',
    secondaryDiagnosis: 'Mild Dyslipidemia',
    medications: [
      {
        id: 'MED-001',
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        dosage: '5mg',
        form: 'Tablet',
        frequency: MedicationFrequency.ONCE_DAILY,
        timing: MedicationTiming.AFTER_FOOD,
        route: MedicationRoute.ORAL,
        durationDays: 30,
        quantity: 30,
        refillsAllowed: 2,
        instructions: 'Take at the same time every day. Do not miss doses.',
        sideEffects: ['Dizziness', 'Ankle swelling', 'Headache'],
      },
      {
        id: 'MED-002',
        name: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        dosage: '10mg',
        form: 'Tablet',
        frequency: MedicationFrequency.ONCE_DAILY,
        timing: MedicationTiming.BEDTIME,
        route: MedicationRoute.ORAL,
        durationDays: 30,
        quantity: 30,
        refillsAllowed: 2,
        instructions: 'Avoid grapefruit juice. Take at bedtime.',
        sideEffects: ['Muscle pain', 'Liver enzyme elevation'],
      },
    ],
    labTests: ['Lipid Profile', 'Kidney Function Test', 'ECG', 'Blood Glucose Fasting'],
    status: PrescriptionStatus.ACTIVE,
    issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Monitor BP twice daily. Reduce salt intake. Exercise 30 min/day. Avoid alcohol.',
    allergiesNoted: ['Penicillin'],
    vitalSigns: {
      bloodPressure: '148/92 mmHg',
      pulse: '78 bpm',
      temperature: '98.4°F',
      weight: '82 kg',
      height: '170 cm',
      spo2: '98%',
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'RX-2024-002',
    patientId: 'PAT-001',
    doctorId: 'DOC-003',
    appointmentId: 'APT-005',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Dermatologist',
    doctorLicenseNumber: 'MCI-2023-MH-87654',
    hospitalName: 'Skin Care Clinic',
    hospitalAddress: '45, Linking Road, Mumbai, Maharashtra - 400050',
    diagnosis: 'Allergic Contact Dermatitis',
    medications: [
      {
        id: 'MED-003',
        name: 'Betamethasone Cream',
        dosage: '0.05%',
        form: 'Cream',
        frequency: MedicationFrequency.TWICE_DAILY,
        timing: MedicationTiming.ANYTIME,
        route: MedicationRoute.TOPICAL,
        durationDays: 14,
        instructions: 'Apply thin layer on affected area. Avoid eyes and mucous membranes.',
      },
      {
        id: 'MED-004',
        name: 'Cetirizine',
        dosage: '10mg',
        form: 'Tablet',
        frequency: MedicationFrequency.ONCE_DAILY,
        timing: MedicationTiming.BEDTIME,
        route: MedicationRoute.ORAL,
        durationDays: 7,
        quantity: 7,
        instructions: 'May cause drowsiness. Avoid driving.',
      },
      {
        id: 'MED-005',
        name: 'Calamine Lotion',
        dosage: 'As required',
        form: 'Lotion',
        frequency: MedicationFrequency.AS_NEEDED,
        timing: MedicationTiming.ANYTIME,
        route: MedicationRoute.TOPICAL,
        durationDays: 14,
        instructions: 'Apply for itch relief as needed.',
      },
    ],
    status: PrescriptionStatus.ACTIVE,
    issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Avoid known allergens. Use hypoallergenic soap. Wear cotton clothing.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'RX-2024-003',
    patientId: 'PAT-001',
    doctorId: 'DOC-002',
    appointmentId: 'APT-007',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'Neurologist',
    doctorLicenseNumber: 'MCI-2022-DL-33210',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '12, MG Road, Bengaluru, Karnataka - 560001',
    diagnosis: 'Migraine with Aura',
    medications: [
      {
        id: 'MED-006',
        name: 'Sumatriptan',
        dosage: '50mg',
        form: 'Tablet',
        frequency: MedicationFrequency.AS_NEEDED,
        timing: MedicationTiming.ANYTIME,
        route: MedicationRoute.ORAL,
        durationDays: 90,
        quantity: 9,
        instructions: 'Take at onset of migraine. Max 2 tablets per attack. Max 3 attacks per month.',
      },
      {
        id: 'MED-007',
        name: 'Propranolol',
        dosage: '40mg',
        form: 'Tablet',
        frequency: MedicationFrequency.TWICE_DAILY,
        timing: MedicationTiming.AFTER_FOOD,
        route: MedicationRoute.ORAL,
        durationDays: 90,
        quantity: 180,
        refillsAllowed: 1,
        instructions: 'Do not stop suddenly. Monitor pulse rate.',
      },
    ],
    labTests: ['MRI Brain', 'Complete Blood Count', 'Thyroid Function Test'],
    status: PrescriptionStatus.COMPLETED,
    issuedAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Maintain a migraine diary. Avoid triggers: bright light, loud noise, stress. Stay hydrated.',
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      pulse: '70 bpm',
      weight: '72 kg',
    },
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'RX-2023-004',
    patientId: 'PAT-001',
    doctorId: 'DOC-004',
    appointmentId: 'APT-010',
    doctorName: 'Dr. James Wilson',
    doctorSpecialization: 'Orthopedic Surgeon',
    doctorLicenseNumber: 'MCI-2020-TN-56789',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '12, MG Road, Bengaluru, Karnataka - 560001',
    diagnosis: 'Acute Lumbar Strain',
    medications: [
      {
        id: 'MED-008',
        name: 'Diclofenac + Paracetamol',
        dosage: '50mg + 500mg',
        form: 'Tablet',
        frequency: MedicationFrequency.THRICE_DAILY,
        timing: MedicationTiming.AFTER_FOOD,
        route: MedicationRoute.ORAL,
        durationDays: 5,
        quantity: 15,
        instructions: 'Do not take on empty stomach. Avoid alcohol.',
      },
      {
        id: 'MED-009',
        name: 'Methocarbamol',
        dosage: '750mg',
        form: 'Tablet',
        frequency: MedicationFrequency.TWICE_DAILY,
        timing: MedicationTiming.AFTER_FOOD,
        route: MedicationRoute.ORAL,
        durationDays: 5,
        quantity: 10,
        instructions: 'May cause drowsiness. Avoid driving.',
      },
    ],
    status: PrescriptionStatus.EXPIRED,
    issuedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Rest for 2-3 days. Hot/cold compress. Physiotherapy after acute phase.',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Service ──────────────────────────────────────────────────────────────────

const BASE = '/patient/prescriptions';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const prescriptionService = {
  async getAll(filters?: PrescriptionFilters): Promise<PrescriptionListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'ALL') params.set('status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);
      if (filters?.doctorId) params.set('doctorId', filters.doctorId);
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));

      const response = await apiClient.get<PrescriptionListResponse>(
        `${BASE}?${params.toString()}`,
      );
      return response.data;
    } catch {
      throw new Error('Failed to fetch prescriptions');
    }
  },

  async getById(id: string): Promise<Prescription> {
    try {
      const response = await apiClient.get<Prescription>(`${BASE}/${id}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch prescription');
    }
  },

  async downloadPDF(id: string): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(`${BASE}/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch {
      throw new Error('Failed to download prescription');
    }
  },
};

// ─── Mock Helpers ─────────────────────────────────────────────────────────────

export const getMockPrescription = (id: string): Prescription => {
  return (
    MOCK_PRESCRIPTIONS.find((p) => p.id === id) ?? {
      ...MOCK_PRESCRIPTIONS[0],
      id,
    }
  );
};

export const getMockPrescriptions = (
  filters?: PrescriptionFilters,
): PrescriptionListResponse => {
  let data = [...MOCK_PRESCRIPTIONS];

  if (filters?.status && filters.status !== 'ALL') {
    data = data.filter((p) => p.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (p) =>
        p.diagnosis.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        p.medications.some((m) => m.name.toLowerCase().includes(q)),
    );
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const start = (page - 1) * limit;

  return {
    data: data.slice(start, start + limit),
    total: data.length,
    page,
    limit,
    hasMore: start + limit < data.length,
  };
};