// client/src/features/patient/hooks/useCancelAppointment.ts

import { useState, useCallback } from 'react';
import type { Appointment, AppointmentStatus } from '../../../types/appointment/appointment.types';

// ============================================================================
// TYPES
// ============================================================================

export interface CancelAppointmentPayload {
  appointmentId: string;
  reason?: string;
  notes?: string;
}

export interface CancelAppointmentResponse {
  success: boolean;
  appointment: Appointment;
  message: string;
  refundAmount?: number;
}

interface UseCancelAppointmentReturn {
  isCancelling: boolean;
  isSuccess: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  cancelledAppointment: Appointment | null;
  cancelAppointment: (payload: CancelAppointmentPayload) => Promise<Appointment>;
  reset: () => void;
  clearError: () => void;
  clearValidationErrors: () => void;
}

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const cancelAppointmentService = {
  cancel: async (payload: CancelAppointmentPayload): Promise<CancelAppointmentResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate validation
    if (!payload.appointmentId) {
      throw new Error('Appointment ID is required');
    }
    
    // Mock cancelled appointment
    const cancelledAppointment: Appointment = {
      id: payload.appointmentId,
      patientId: 'patient_001',
      doctorId: 'doc_001',
      hospitalId: 'hospital_001',
      status: 'CANCELLED_BY_PATIENT' as AppointmentStatus,
      scheduledAt: new Date().toISOString(),
      durationMinutes: 30,
      reason: payload.reason,
      cancellationReason: payload.reason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'patient_001',
      cancellationNotes: payload.notes,
      type: 'IN_PERSON',
      priority: 'ROUTINE',
      location: {
        name: 'City Hospital',
        address: '123 Main St',
      },
      isEmergency: false,
      isActive: false,
      isDeleted: false,
      version: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Appointment;
    
    return {
      success: true,
      appointment: cancelledAppointment,
      message: 'Appointment cancelled successfully',
      refundAmount: 50,
    };
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useCancelAppointment = (): UseCancelAppointmentReturn => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [cancelledAppointment, setCancelledAppointment] = useState<Appointment | null>(null);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setValidationErrors({});
    setCancelledAppointment(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearValidationErrors = useCallback(() => setValidationErrors({}), []);

  const validatePayload = useCallback((payload: CancelAppointmentPayload): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!payload.appointmentId) {
      errors.appointmentId = 'Appointment ID is required';
    }
    
    if (payload.reason && payload.reason.length < 3) {
      errors.reason = 'Reason must be at least 3 characters';
    }
    
    if (payload.reason && payload.reason.length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters';
    }
    
    return errors;
  }, []);

  const cancelAppointment = useCallback(async (payload: CancelAppointmentPayload): Promise<Appointment> => {
    setIsCancelling(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);
    
    // Validate payload
    const errors = validatePayload(payload);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsCancelling(false);
      throw new Error('Validation failed');
    }
    
    try {
      const response = await cancelAppointmentService.cancel(payload);
      setCancelledAppointment(response.appointment);
      setIsSuccess(true);
      return response.appointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel appointment';
      setError(errorMessage);
      console.error('[useCancelAppointment] Error:', err);
      throw err;
    } finally {
      setIsCancelling(false);
    }
  }, [validatePayload]);

  return {
    isCancelling,
    isSuccess,
    error,
    validationErrors,
    cancelledAppointment,
    cancelAppointment,
    reset,
    clearError,
    clearValidationErrors,
  };
};

export default useCancelAppointment;