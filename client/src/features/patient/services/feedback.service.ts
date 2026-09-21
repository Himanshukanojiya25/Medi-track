// client/src/features/patient/services/feedback.service.ts

import { httpClient } from '../../../services/api/http.client';
import type { ID, ISODateString } from '../../../types/shared';

// ============================================================================
// ENUMS
// ============================================================================

export enum FeedbackEntityType {
  DOCTOR   = 'DOCTOR',
  HOSPITAL = 'HOSPITAL',
}

export enum FeedbackStatus {
  PENDING   = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED  = 'REJECTED',
  FLAGGED   = 'FLAGGED',
}

// ============================================================================
// TYPES
// ============================================================================

export interface FeedbackRating {
  overall: number;
  cleanliness?: number;
  staffBehavior?: number;
  waitingTime?: number;
  treatmentQuality?: number;
}

export interface Feedback {
  readonly id: ID;
  readonly patientId: ID;
  readonly entityId: ID;
  readonly entityType: FeedbackEntityType;
  readonly appointmentId?: ID;
  readonly rating: FeedbackRating;
  readonly review: string;
  readonly tags?: string[];
  readonly status: FeedbackStatus;
  readonly isAnonymous: boolean;
  readonly helpful: number;
  readonly reply?: string;
  readonly repliedAt?: ISODateString;
  readonly repliedBy?: ID;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface SubmitFeedbackPayload {
  entityId: ID;
  entityType: FeedbackEntityType;
  appointmentId?: ID;
  rating: FeedbackRating;
  review: string;
  tags?: string[];
  isAnonymous?: boolean;
}

export interface UpdateFeedbackPayload {
  rating?: FeedbackRating;
  review?: string;
  tags?: string[];
}

export interface FeedbackListParams {
  entityType?: FeedbackEntityType;
  entityId?: ID;
  page?: number;
  limit?: number;
}

export interface FeedbackListResponse {
  success: boolean;
  data: Feedback[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FeedbackResponse {
  success: boolean;
  data: Feedback;
  message?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

const API_BASE     = '/api/v1/feedback';
const PATIENT_BASE = '/api/v1/patients/me/feedback';

export const feedbackService = {

  /**
   * Get all feedback submitted by the patient
   * GET /api/v1/patients/me/feedback
   */
  getMyFeedback: async (params?: FeedbackListParams): Promise<FeedbackListResponse> => {
    const response = await httpClient.get<FeedbackListResponse>(PATIENT_BASE, {
      params,
    });
    return response.data;
  },

  /**
   * Submit new feedback for a doctor or hospital
   * POST /api/v1/feedback
   */
  submit: async (payload: SubmitFeedbackPayload): Promise<Feedback> => {
    const response = await httpClient.post<FeedbackResponse>(API_BASE, payload);
    return response.data.data;
  },

  /**
   * Update existing feedback (within edit window)
   * PUT /api/v1/feedback/:id
   */
  update: async (id: ID, payload: UpdateFeedbackPayload): Promise<Feedback> => {
    const response = await httpClient.put<FeedbackResponse>(
      `${API_BASE}/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete feedback (within allowed window)
   * DELETE /api/v1/feedback/:id
   */
  delete: async (id: ID): Promise<void> => {
    await httpClient.delete(`${API_BASE}/${id}`);
  },

  /**
   * Mark feedback as helpful
   * PATCH /api/v1/feedback/:id/helpful
   */
  markHelpful: async (id: ID): Promise<void> => {
    await httpClient.patch(`${API_BASE}/${id}/helpful`);
  },

  /**
   * Check if the patient has already submitted feedback for an appointment
   * GET /api/v1/feedback/check?appointmentId=:appointmentId
   */
  checkSubmitted: async (appointmentId: ID): Promise<boolean> => {
    const response = await httpClient.get<{ success: boolean; data: { submitted: boolean } }>(
      `${API_BASE}/check`,
      { params: { appointmentId } },
    );
    return response.data.data.submitted;
  },

} as const;

export default feedbackService;