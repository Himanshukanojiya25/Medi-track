import { httpClient } from '../../../services/api/http.client';
import type { ID, ISODateString } from '../../../types/shared';

// ============================================================================
// ENUMS
// ============================================================================

export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  CONFIRMED   = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED   = 'COMPLETED',
  CANCELLED   = 'CANCELLED',
  NO_SHOW     = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AppointmentType {
  IN_PERSON  = 'IN_PERSON',
  VIDEO      = 'VIDEO',
  PHONE      = 'PHONE',
}

// ============================================================================
// TYPES
// ============================================================================

export interface Appointment {
  readonly id: ID;
  readonly patientId: ID;
  readonly doctorId: ID;
  readonly hospitalId: ID;
  readonly doctorName: string;
  readonly doctorSpecialization?: string;
  readonly doctorProfilePicture?: string;
  readonly hospitalName?: string;
  readonly scheduledAt: ISODateString;
  readonly durationMinutes: number;
  readonly status: AppointmentStatus;
  readonly type?: AppointmentType;
  readonly reason?: string;
  readonly notes?: string;
  readonly cancelReason?: string;
  readonly rescheduleReason?: string;
  readonly consultationFee?: number;
  readonly isPaid?: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface BookAppointmentPayload {
  doctorId: ID;
  scheduledAt: ISODateString;
  durationMinutes?: number;
  reason?: string;
  type?: AppointmentType;
}

export interface RescheduleAppointmentPayload {
  scheduledAt: ISODateString;
  reason?: string;
}

export interface CancelAppointmentPayload {
  reason: string;
}

export type AppointmentListType = 'UPCOMING' | 'PAST' | 'ALL';

export interface AppointmentListParams {
  type?: AppointmentListType;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
}

export interface AppointmentListResponse {
  success: boolean;
  data: Appointment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AppointmentResponse {
  success: boolean;
  data: Appointment;
  message?: string;
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateMockAppointments = (): Appointment[] => {
  const today = new Date();
  
  return [
    {
      id: 'mock-001',
      patientId: 'PAT-001',
      doctorId: 'DOC-001',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 30).toISOString(),
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      type: AppointmentType.IN_PERSON,
      reason: 'Chest pain and shortness of breath',
      consultationFee: 1500,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-002',
      patientId: 'PAT-001',
      doctorId: 'DOC-002',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Neurologist',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 0).toISOString(),
      durationMinutes: 45,
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.VIDEO,
      reason: 'Severe headaches and occasional dizziness',
      consultationFee: 2000,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-003',
      patientId: 'PAT-001',
      doctorId: 'DOC-003',
      hospitalId: 'HOS-002',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialization: 'Dermatologist',
      doctorProfilePicture: '',
      hospitalName: 'Skin Care Clinic',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 11, 15).toISOString(),
      durationMinutes: 20,
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.IN_PERSON,
      reason: 'Skin rash and allergy concerns',
      notes: 'Prescribed topical cream. Follow up in 2 weeks.',
      consultationFee: 1200,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-004',
      patientId: 'PAT-001',
      doctorId: 'DOC-004',
      hospitalId: 'HOS-001',
      doctorName: 'Dr. James Wilson',
      doctorSpecialization: 'Orthopedic Surgeon',
      doctorProfilePicture: '',
      hospitalName: 'MediCare Super Speciality Hospital',
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0).toISOString(),
      durationMinutes: 60,
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.PHONE,
      reason: 'Knee pain and swelling',
      consultationFee: 2500,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-005',
      patientId: 'PAT-001',
      doctorId: 'DOC-005',
      hospitalId: 'HOS-003',
      doctorName: 'Dr. Priya Sharma',
      doctorSpecialization: 'Pediatrician',
      doctorProfilePicture: '',
      hospitalName: "Children's Health Center",
      scheduledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 16, 30).toISOString(),
      durationMinutes: 30,
      status: AppointmentStatus.CANCELLED,
      type: AppointmentType.IN_PERSON,
      reason: 'Child fever and cough',
      cancelReason: 'Patient requested cancellation due to schedule conflict',
      consultationFee: 1000,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const getMockAppointmentById = (id: string): Appointment | null => {
  const mockAppointments = generateMockAppointments();
  return mockAppointments.find(apt => apt.id === id) || null;
};

const filterMockAppointments = (
  appointments: Appointment[],
  params?: AppointmentListParams
): Appointment[] => {
  let filtered = [...appointments];
  
  if (params?.type === 'UPCOMING') {
    filtered = filtered.filter(a => 
      new Date(a.scheduledAt) > new Date() && 
      a.status !== AppointmentStatus.CANCELLED &&
      a.status !== AppointmentStatus.COMPLETED
    );
  } else if (params?.type === 'PAST') {
    filtered = filtered.filter(a => 
      new Date(a.scheduledAt) < new Date() ||
      a.status === AppointmentStatus.COMPLETED ||
      a.status === AppointmentStatus.CANCELLED
    );
  }
  
  if (params?.status) {
    filtered = filtered.filter(a => a.status === params.status);
  }
  
  return filtered;
};

// ============================================================================
// SERVICE WITH MOCK FALLBACK
// ============================================================================

const API_BASE = '/api/v1/patient/appointments';

export const appointmentService = {

  /**
   * Book a new appointment
   * POST /api/v1/patient/appointments
   */
  book: async (payload: BookAppointmentPayload): Promise<Appointment> => {
    try {
      const response = await httpClient.post<AppointmentResponse>(API_BASE, payload);
      return response.data.data;
    } catch (error) {
      console.warn('API failed, using mock response for booking');
      // Mock booking response
      const mockAppointment: Appointment = {
        id: `mock-${Date.now()}`,
        patientId: 'PAT-001',
        doctorId: payload.doctorId,
        hospitalId: 'HOS-001',
        doctorName: 'Dr. Sample Doctor',
        doctorSpecialization: 'General Physician',
        hospitalName: 'Sample Hospital',
        scheduledAt: payload.scheduledAt,
        durationMinutes: payload.durationMinutes || 30,
        status: AppointmentStatus.SCHEDULED,
        type: payload.type,
        reason: payload.reason,
        consultationFee: 1500,
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockAppointment;
    }
  },

  /**
   * Get patient's appointments (upcoming / past / all)
   * GET /api/v1/patient/appointments
   */
  list: async (params?: AppointmentListParams): Promise<AppointmentListResponse> => {
    try {
      const response = await httpClient.get<AppointmentListResponse>(API_BASE, { params });
      return response.data;
    } catch (error) {
      console.warn('API failed, using mock data for appointments list');
      const mockAppointments = generateMockAppointments();
      const filtered = filterMockAppointments(mockAppointments, params);
      
      return {
        success: true,
        data: filtered,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: filtered.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },

  /**
   * Get single appointment by ID
   * GET /api/v1/patient/appointments/:id
   */
  getById: async (id: ID): Promise<Appointment> => {
    try {
      const response = await httpClient.get<AppointmentResponse>(`${API_BASE}/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for appointment ${id}, using mock data`);
      const mockAppointment = getMockAppointmentById(id);
      if (mockAppointment) {
        return mockAppointment;
      }
      // Fallback mock appointment
      return {
        id: id,
        patientId: 'PAT-001',
        doctorId: 'DOC-001',
        hospitalId: 'HOS-001',
        doctorName: 'Dr. Sarah Johnson',
        doctorSpecialization: 'Cardiologist',
        hospitalName: 'MediCare Hospital',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
        type: AppointmentType.IN_PERSON,
        reason: 'Regular checkup',
        consultationFee: 1500,
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Reschedule an appointment
   * PATCH /api/v1/patient/appointments/:id/reschedule
   */
  reschedule: async (
    id: ID,
    payload: RescheduleAppointmentPayload,
  ): Promise<Appointment> => {
    try {
      const response = await httpClient.patch<AppointmentResponse>(
        `${API_BASE}/${id}/reschedule`,
        payload,
      );
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for reschedule ${id}, using mock response`);
      const existingMock = getMockAppointmentById(id);
      if (existingMock) {
        return {
          ...existingMock,
          scheduledAt: payload.scheduledAt,
          status: AppointmentStatus.SCHEDULED,
          rescheduleReason: payload.reason,
          updatedAt: new Date().toISOString(),
        };
      }
      throw new Error('Appointment not found');
    }
  },

  /**
   * Cancel an appointment
   * PATCH /api/v1/patient/appointments/:id/cancel
   */
  cancel: async (id: ID, payload: CancelAppointmentPayload): Promise<Appointment> => {
    try {
      const response = await httpClient.patch<AppointmentResponse>(
        `${API_BASE}/${id}/cancel`,
        payload,
      );
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for cancel ${id}, using mock response`);
      const existingMock = getMockAppointmentById(id);
      if (existingMock) {
        return {
          ...existingMock,
          status: AppointmentStatus.CANCELLED,
          cancelReason: payload.reason,
          updatedAt: new Date().toISOString(),
        };
      }
      throw new Error('Appointment not found');
    }
  },

  /**
   * Get available time slots for a doctor on a given date
   * GET /api/v1/doctors/:doctorId/slots?date=YYYY-MM-DD
   */
  getAvailableSlots: async (
    doctorId: ID,
    date: string,
  ): Promise<string[]> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: string[] }>(
        `/api/v1/doctors/${doctorId}/slots`,
        { params: { date } },
      );
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for slots, using mock data`);
      // Mock slots
      return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    }
  },

} as const;

export default appointmentService;