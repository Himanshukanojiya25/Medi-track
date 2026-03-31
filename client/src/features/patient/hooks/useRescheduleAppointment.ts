// client/src/features/patient/hooks/useRescheduleAppointment.ts

import { useState, useCallback } from 'react';
import type { 
  Appointment, 
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  AppointmentLocation
} from '../../../types/appointment/appointment.types';

// ============================================================================
// TYPES
// ============================================================================

export interface RescheduleAppointmentPayload {
  appointmentId: string;
  newScheduledAt: string;
  reason?: string;
}

export interface RescheduleAppointmentResponse {
  success: boolean;
  appointment: Appointment;
  message: string;
  previousDate: string;
  newDate: string;
}

interface UseRescheduleAppointmentReturn {
  isRescheduling: boolean;
  isSuccess: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  rescheduledAppointment: Appointment | null;
  rescheduleAppointment: (payload: RescheduleAppointmentPayload) => Promise<Appointment>;
  reset: () => void;
  clearError: () => void;
  clearValidationErrors: () => void;
}

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const rescheduleAppointmentService = {
  reschedule: async (payload: RescheduleAppointmentPayload): Promise<RescheduleAppointmentResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (!payload.appointmentId) {
      throw new Error('Appointment ID is required');
    }
    
    const appointmentDate = new Date(payload.newScheduledAt);
    if (appointmentDate <= new Date()) {
      throw new Error('New appointment date must be in the future');
    }
    
    const mockLocation: AppointmentLocation = {
      name: 'City Hospital',
      address: '123 Main St, Cityville',
      room: 'Room 204',
      floor: '2nd Floor',
      building: 'Main Building',
    };
    
    const rescheduledAppointment: Appointment = {
      id: payload.appointmentId,
      patientId: 'patient_001',
      doctorId: 'doc_001',
      hospitalId: 'hospital_001',
      status: 'RESCHEDULED' as AppointmentStatus,
      scheduledAt: payload.newScheduledAt,
      durationMinutes: 30,
      reason: payload.reason,
      type: 'IN_PERSON' as AppointmentType,
      priority: 'ROUTINE' as AppointmentPriority,
      location: mockLocation,
      isEmergency: false,
      isActive: true,
      isDeleted: false,
      version: 2,
      rescheduleCount: 1,
      rescheduleHistory: [
        {
          previousDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          newDate: payload.newScheduledAt,
          reason: payload.reason,
          requestedBy: 'patient',
          status: 'approved',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      appointment: rescheduledAppointment,
      message: 'Appointment rescheduled successfully',
      previousDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      newDate: payload.newScheduledAt,
    };
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useRescheduleAppointment = (): UseRescheduleAppointmentReturn => {
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rescheduledAppointment, setRescheduledAppointment] = useState<Appointment | null>(null);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setValidationErrors({});
    setRescheduledAppointment(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearValidationErrors = useCallback(() => setValidationErrors({}), []);

  const validatePayload = useCallback((payload: RescheduleAppointmentPayload): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!payload.appointmentId) {
      errors.appointmentId = 'Appointment ID is required';
    }
    
    if (!payload.newScheduledAt) {
      errors.newScheduledAt = 'New date and time are required';
    } else {
      const newDate = new Date(payload.newScheduledAt);
      if (isNaN(newDate.getTime())) {
        errors.newScheduledAt = 'Invalid date format';
      } else if (newDate <= new Date()) {
        errors.newScheduledAt = 'New appointment date must be in the future';
      }
    }
    
    if (payload.reason && payload.reason.length < 3) {
      errors.reason = 'Reason must be at least 3 characters';
    }
    
    if (payload.reason && payload.reason.length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters';
    }
    
    return errors;
  }, []);

  const rescheduleAppointment = useCallback(async (payload: RescheduleAppointmentPayload): Promise<Appointment> => {
    setIsRescheduling(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);
    
    const errors = validatePayload(payload);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsRescheduling(false);
      throw new Error('Validation failed');
    }
    
    try {
      const response = await rescheduleAppointmentService.reschedule(payload);
      setRescheduledAppointment(response.appointment);
      setIsSuccess(true);
      return response.appointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reschedule appointment';
      setError(errorMessage);
      console.error('[useRescheduleAppointment] Error:', err);
      throw err;
    } finally {
      setIsRescheduling(false);
    }
  }, [validatePayload]);

  return {
    isRescheduling,
    isSuccess,
    error,
    validationErrors,
    rescheduledAppointment,
    rescheduleAppointment,
    reset,
    clearError,
    clearValidationErrors,
  };
};

export default useRescheduleAppointment;