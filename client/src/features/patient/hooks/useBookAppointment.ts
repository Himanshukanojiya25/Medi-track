// client/src/features/patient/hooks/useBookAppointment.ts

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

export interface BookAppointmentPayload {
  doctorId: string;
  hospitalId: string;
  scheduledAt: string;
  durationMinutes?: number;
  reason?: string;
  type?: AppointmentType;
  priority?: AppointmentPriority;
}

export interface BookAppointmentResponse {
  appointment: Appointment;
  message: string;
}

interface UseBookAppointmentReturn {
  isBooking: boolean;
  isSuccess: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  bookedAppointment: Appointment | null;
  bookAppointment: (payload: BookAppointmentPayload) => Promise<Appointment>;
  reset: () => void;
  clearError: () => void;
  clearValidationErrors: () => void;
}

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const bookAppointmentService = {
  book: async (payload: BookAppointmentPayload): Promise<BookAppointmentResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    if (payload.scheduledAt) {
      const appointmentDate = new Date(payload.scheduledAt);
      if (appointmentDate <= new Date()) {
        throw new Error('Appointment date must be in the future');
      }
    }
    
    // Create mock appointment matching your Appointment type
    const mockLocation: AppointmentLocation = {
      id: 'loc_main',
      name: 'Main Hospital',
      address: '123 Healthcare Ave, Medical District',
      room: 'Room 101',
      floor: '1st Floor',
      building: 'Main Building',
      instructions: 'Please arrive 15 minutes before appointment time',
    };
    
    const newAppointment: Appointment = {
      id: `apt_${Math.random().toString(36).substr(2, 9)}`,
      patientId: 'current-patient-id',
      doctorId: payload.doctorId,
      hospitalId: payload.hospitalId,
      status: 'CONFIRMED' as AppointmentStatus,
      scheduledAt: payload.scheduledAt,
      durationMinutes: payload.durationMinutes || 30,
      reason: payload.reason,
      type: payload.type || 'IN_PERSON' as AppointmentType,
      priority: payload.priority || 'ROUTINE' as AppointmentPriority,
      location: mockLocation,
      isEmergency: false,
      isActive: true,
      isDeleted: false,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return {
      appointment: newAppointment,
      message: 'Appointment booked successfully',
    };
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useBookAppointment = (): UseBookAppointmentReturn => {
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setValidationErrors({});
    setBookedAppointment(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  
  const clearValidationErrors = useCallback(() => setValidationErrors({}), []);

  const validatePayload = useCallback((payload: BookAppointmentPayload): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!payload.doctorId) {
      errors.doctorId = 'Doctor is required';
    }
    
    if (!payload.hospitalId) {
      errors.hospitalId = 'Hospital is required';
    }
    
    if (!payload.scheduledAt) {
      errors.scheduledAt = 'Date and time are required';
    } else {
      const appointmentDate = new Date(payload.scheduledAt);
      if (isNaN(appointmentDate.getTime())) {
        errors.scheduledAt = 'Invalid date format';
      } else if (appointmentDate <= new Date()) {
        errors.scheduledAt = 'Appointment date must be in the future';
      }
    }
    
    if (payload.durationMinutes && payload.durationMinutes <= 0) {
      errors.durationMinutes = 'Duration must be greater than 0';
    }
    
    if (payload.durationMinutes && payload.durationMinutes > 240) {
      errors.durationMinutes = 'Duration cannot exceed 240 minutes';
    }
    
    return errors;
  }, []);

  const bookAppointment = useCallback(async (payload: BookAppointmentPayload): Promise<Appointment> => {
    setIsBooking(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);
    
    // Validate payload
    const errors = validatePayload(payload);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsBooking(false);
      throw new Error('Validation failed');
    }
    
    try {
      const response = await bookAppointmentService.book(payload);
      setBookedAppointment(response.appointment);
      setIsSuccess(true);
      return response.appointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book appointment';
      setError(errorMessage);
      console.error('[useBookAppointment] Error:', err);
      throw err;
    } finally {
      setIsBooking(false);
    }
  }, [validatePayload]);

  return {
    isBooking,
    isSuccess,
    error,
    validationErrors,
    bookedAppointment,
    bookAppointment,
    reset,
    clearError,
    clearValidationErrors,
  };
};

export default useBookAppointment;