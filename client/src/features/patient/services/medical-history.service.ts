// client/src/features/patient/services/medical-history.service.ts

import { httpClient } from '../../../services/api/http.client';
import type {
  MedicalHistory,
  MedicalCondition,
  Allergy,
  Medication,
  Surgery,
  Immunization,
  VitalSigns,
  AddConditionPayload,
  AddAllergyPayload,
  AddMedicationPayload,
  AddSurgeryPayload,
  AddImmunizationPayload,
  AddVitalSignsPayload,
  UpdateConditionPayload,
  UpdateAllergyPayload,
  UpdateMedicationPayload,
  UpdateSurgeryPayload,
  UpdateImmunizationPayload,
  MedicalHistoryApiResponse,
  ConditionApiResponse,
  AllergyApiResponse,
  MedicationApiResponse,
  VitalSignsApiResponse,
} from '../../../types/patient/medical-history.types';
import type { ID } from '../../../types/shared';

// ============================================================================
// TYPES
// ============================================================================

interface SimpleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

const API_BASE = '/api/v1/patients/me/medical-history';

export const medicalHistoryService = {

  // ── FULL HISTORY ────────────────────────────────────────────────────────────

  /**
   * Get complete medical history for the logged-in patient
   * GET /api/v1/patients/me/medical-history
   */
  get: async (): Promise<MedicalHistory> => {
    const response = await httpClient.get<MedicalHistoryApiResponse>(API_BASE);
    return response.data.data;
  },

  // ── CONDITIONS ──────────────────────────────────────────────────────────────

  /**
   * Get all conditions
   * GET /api/v1/patients/me/medical-history/conditions
   */
  getConditions: async (): Promise<MedicalCondition[]> => {
    const response = await httpClient.get<SimpleResponse<MedicalCondition[]>>(
      `${API_BASE}/conditions`,
    );
    return response.data.data;
  },

  /**
   * Add a new condition
   * POST /api/v1/patients/me/medical-history/conditions
   */
  addCondition: async (payload: AddConditionPayload): Promise<MedicalCondition> => {
    const response = await httpClient.post<ConditionApiResponse>(
      `${API_BASE}/conditions`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Update a condition
   * PUT /api/v1/patients/me/medical-history/conditions/:id
   */
  updateCondition: async (
    id: ID,
    payload: UpdateConditionPayload,
  ): Promise<MedicalCondition> => {
    const response = await httpClient.put<ConditionApiResponse>(
      `${API_BASE}/conditions/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a condition
   * DELETE /api/v1/patients/me/medical-history/conditions/:id
   */
  deleteCondition: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/conditions/${id}`);
  },

  // ── ALLERGIES ───────────────────────────────────────────────────────────────

  /**
   * Get all allergies
   * GET /api/v1/patients/me/medical-history/allergies
   */
  getAllergies: async (): Promise<Allergy[]> => {
    const response = await httpClient.get<SimpleResponse<Allergy[]>>(
      `${API_BASE}/allergies`,
    );
    return response.data.data;
  },

  /**
   * Add a new allergy
   * POST /api/v1/patients/me/medical-history/allergies
   */
  addAllergy: async (payload: AddAllergyPayload): Promise<Allergy> => {
    const response = await httpClient.post<AllergyApiResponse>(
      `${API_BASE}/allergies`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Update an allergy
   * PUT /api/v1/patients/me/medical-history/allergies/:id
   */
  updateAllergy: async (
    id: ID,
    payload: UpdateAllergyPayload,
  ): Promise<Allergy> => {
    const response = await httpClient.put<AllergyApiResponse>(
      `${API_BASE}/allergies/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete an allergy
   * DELETE /api/v1/patients/me/medical-history/allergies/:id
   */
  deleteAllergy: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/allergies/${id}`);
  },

  // ── MEDICATIONS ─────────────────────────────────────────────────────────────

  /**
   * Get all medications
   * GET /api/v1/patients/me/medical-history/medications
   */
  getMedications: async (): Promise<Medication[]> => {
    const response = await httpClient.get<SimpleResponse<Medication[]>>(
      `${API_BASE}/medications`,
    );
    return response.data.data;
  },

  /**
   * Add a new medication
   * POST /api/v1/patients/me/medical-history/medications
   */
  addMedication: async (payload: AddMedicationPayload): Promise<Medication> => {
    const response = await httpClient.post<MedicationApiResponse>(
      `${API_BASE}/medications`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Update a medication
   * PUT /api/v1/patients/me/medical-history/medications/:id
   */
  updateMedication: async (
    id: ID,
    payload: UpdateMedicationPayload,
  ): Promise<Medication> => {
    const response = await httpClient.put<MedicationApiResponse>(
      `${API_BASE}/medications/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a medication
   * DELETE /api/v1/patients/me/medical-history/medications/:id
   */
  deleteMedication: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/medications/${id}`);
  },

  // ── SURGERIES ───────────────────────────────────────────────────────────────

  /**
   * Get all surgeries
   * GET /api/v1/patients/me/medical-history/surgeries
   */
  getSurgeries: async (): Promise<Surgery[]> => {
    const response = await httpClient.get<SimpleResponse<Surgery[]>>(
      `${API_BASE}/surgeries`,
    );
    return response.data.data;
  },

  /**
   * Add a new surgery record
   * POST /api/v1/patients/me/medical-history/surgeries
   */
  addSurgery: async (payload: AddSurgeryPayload): Promise<Surgery> => {
    const response = await httpClient.post<SimpleResponse<Surgery>>(
      `${API_BASE}/surgeries`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Update a surgery record
   * PUT /api/v1/patients/me/medical-history/surgeries/:id
   */
  updateSurgery: async (
    id: ID,
    payload: UpdateSurgeryPayload,
  ): Promise<Surgery> => {
    const response = await httpClient.put<SimpleResponse<Surgery>>(
      `${API_BASE}/surgeries/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a surgery record
   * DELETE /api/v1/patients/me/medical-history/surgeries/:id
   */
  deleteSurgery: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/surgeries/${id}`);
  },

  // ── IMMUNIZATIONS ───────────────────────────────────────────────────────────

  /**
   * Get all immunizations
   * GET /api/v1/patients/me/medical-history/immunizations
   */
  getImmunizations: async (): Promise<Immunization[]> => {
    const response = await httpClient.get<SimpleResponse<Immunization[]>>(
      `${API_BASE}/immunizations`,
    );
    return response.data.data;
  },

  /**
   * Add an immunization record
   * POST /api/v1/patients/me/medical-history/immunizations
   */
  addImmunization: async (
    payload: AddImmunizationPayload,
  ): Promise<Immunization> => {
    const response = await httpClient.post<SimpleResponse<Immunization>>(
      `${API_BASE}/immunizations`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete an immunization record
   * DELETE /api/v1/patients/me/medical-history/immunizations/:id
   */
  deleteImmunization: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/immunizations/${id}`);
  },

  // ── VITAL SIGNS ─────────────────────────────────────────────────────────────

  /**
   * Get all vital signs records
   * GET /api/v1/patients/me/medical-history/vitals
   */
  getVitals: async (): Promise<VitalSigns[]> => {
    const response = await httpClient.get<SimpleResponse<VitalSigns[]>>(
      `${API_BASE}/vitals`,
    );
    return response.data.data;
  },

  /**
   * Add a new vitals reading
   * POST /api/v1/patients/me/medical-history/vitals
   */
  addVitals: async (payload: AddVitalSignsPayload): Promise<VitalSigns> => {
    const response = await httpClient.post<VitalSignsApiResponse>(
      `${API_BASE}/vitals`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Get latest vitals reading
   * GET /api/v1/patients/me/medical-history/vitals/latest
   */
  getLatestVitals: async (): Promise<VitalSigns | null> => {
    const response = await httpClient.get<SimpleResponse<VitalSigns | null>>(
      `${API_BASE}/vitals/latest`,
    );
    return response.data.data;
  },

} as const;

export default medicalHistoryService;