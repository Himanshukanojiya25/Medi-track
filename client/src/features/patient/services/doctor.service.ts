import { httpClient } from '../../../services/api/http.client';
import type { Doctor, DoctorFilters, DoctorProfile, DoctorReview } from '../../../types/patient/doctor.types';
import { DoctorStatus, DoctorSpeciality } from '../../../types/patient/doctor.types';
import type { ID } from '../../../types/shared';

// ============================================================================
// TYPES
// ============================================================================

export interface DoctorListParams extends DoctorFilters {
  page?: number;
  limit?: number;
}

export interface DoctorListResponse {
  success: boolean;
  data: Doctor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DoctorResponse {
  success: boolean;
  data: Doctor;
  message?: string;
}

export interface DoctorProfileResponse {
  success: boolean;
  data: DoctorProfile;
  message?: string;
}

export interface DoctorReviewsResponse {
  success: boolean;
  data: DoctorReview[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FavoriteDoctorResponse {
  success: boolean;
  data: { isFavorite: boolean };
  message?: string;
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const generateMockDoctors = (): Doctor[] => {
  return [
    {
      id: 'doc-001',
      userId: 'user-001',
      hospitalId: 'hos-001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@meditrack.com',
      phone: '+91-98765-43210',
      profilePicture: '',
      specialization: DoctorSpeciality.CARDIOLOGY,
      qualifications: ['MD Cardiology', 'MBBS'],
      experience: 12,
      languages: ['English', 'Hindi'],
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
      consultationFee: 1500,
      feeType: 'FIXED' as any,
      rating: 4.9,
      totalReviews: 128,
      totalPatients: 450,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-002',
      userId: 'user-002',
      hospitalId: 'hos-001',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@meditrack.com',
      phone: '+91-98765-43211',
      profilePicture: '',
      specialization: DoctorSpeciality.NEUROLOGY,
      qualifications: ['MD Neurology', 'MBBS', 'DM Neurology'],
      experience: 15,
      languages: ['English', 'Mandarin'],
      bio: 'Leading neurologist with expertise in stroke and epilepsy management.',
      consultationFee: 2000,
      feeType: 'FIXED' as any,
      rating: 4.8,
      totalReviews: 95,
      totalPatients: 320,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-003',
      userId: 'user-003',
      hospitalId: 'hos-002',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@meditrack.com',
      phone: '+91-98765-43212',
      profilePicture: '',
      specialization: DoctorSpeciality.DERMATOLOGY,
      qualifications: ['MD Dermatology', 'MBBS'],
      experience: 8,
      languages: ['English', 'Spanish'],
      bio: 'Skin care specialist treating acne, eczema, and cosmetic dermatology.',
      consultationFee: 1200,
      feeType: 'FIXED' as any,
      rating: 4.9,
      totalReviews: 210,
      totalPatients: 680,
      status: DoctorStatus.BUSY,
      isVerified: true,
      isAvailableToday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-004',
      userId: 'user-004',
      hospitalId: 'hos-001',
      name: 'Dr. James Wilson',
      email: 'james.wilson@meditrack.com',
      phone: '+91-98765-43213',
      profilePicture: '',
      specialization: DoctorSpeciality.ORTHOPEDICS,
      qualifications: ['MS Orthopedics', 'MBBS'],
      experience: 18,
      languages: ['English'],
      bio: 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
      consultationFee: 2500,
      feeType: 'FIXED' as any,
      rating: 4.7,
      totalReviews: 156,
      totalPatients: 520,
      status: DoctorStatus.ACTIVE,
      isVerified: true,
      isAvailableToday: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-005',
      userId: 'user-005',
      hospitalId: 'hos-003',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@meditrack.com',
      phone: '+91-98765-43214',
      profilePicture: '',
      specialization: DoctorSpeciality.PEDIATRICS,
      qualifications: ['MD Pediatrics', 'MBBS'],
      experience: 10,
      languages: ['English', 'Hindi', 'Marathi'],
      bio: 'Compassionate pediatrician caring for children from birth to adolescence.',
      consultationFee: 1000,
      feeType: 'FIXED' as any,
      rating: 4.9,
      totalReviews: 178,
      totalPatients: 890,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-006',
      userId: 'user-006',
      hospitalId: 'hos-001',
      name: 'Dr. Robert Taylor',
      email: 'robert.taylor@meditrack.com',
      phone: '+91-98765-43215',
      profilePicture: '',
      specialization: DoctorSpeciality.GENERAL_MEDICINE,
      qualifications: ['MD Internal Medicine', 'MBBS'],
      experience: 20,
      languages: ['English'],
      bio: 'General physician with expertise in managing chronic diseases and preventive care.',
      consultationFee: 800,
      feeType: 'FIXED' as any,
      rating: 4.6,
      totalReviews: 234,
      totalPatients: 1200,
      status: DoctorStatus.ON_LEAVE,
      isVerified: true,
      isAvailableToday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const getMockDoctorById = (id: string): Doctor | null => {
  const mockDoctors = generateMockDoctors();
  return mockDoctors.find(doc => doc.id === id) || null;
};

const filterMockDoctors = (
  doctors: Doctor[],
  params?: DoctorListParams
): Doctor[] => {
  let filtered = [...doctors];
  
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchLower) ||
      doc.specialization.toLowerCase().includes(searchLower) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(searchLower))
    );
  }
  
  if (params?.specialization) {
    filtered = filtered.filter(doc => doc.specialization === params.specialization);
  }
  
  if (params?.minExperience) {
    filtered = filtered.filter(doc => doc.experience >= params.minExperience!);
  }
  
  if (params?.maxFee) {
    filtered = filtered.filter(doc => doc.consultationFee <= params.maxFee!);
  }
  
  if (params?.rating) {
    filtered = filtered.filter(doc => doc.rating >= params.rating!);
  }
  
  if (params?.availableToday) {
    filtered = filtered.filter(doc => doc.isAvailableToday === true);
  }
  
  return filtered;
};

// ============================================================================
// SERVICE WITH MOCK FALLBACK
// ============================================================================

const API_BASE = '/api/v1/doctors';

export const doctorService = {

  /**
   * List doctors with filters (for patient browse)
   * GET /api/v1/doctors
   */
  list: async (params?: DoctorListParams): Promise<DoctorListResponse> => {
    try {
      const response = await httpClient.get<DoctorListResponse>(API_BASE, { params });
      return response.data;
    } catch (error) {
      console.warn('API failed for doctors list, using mock data');
      const mockDoctors = generateMockDoctors();
      const filtered = filterMockDoctors(mockDoctors, params);
      
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = filtered.slice(start, end);
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          page: page,
          limit: limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
          hasNextPage: end < filtered.length,
          hasPrevPage: page > 1,
        },
      };
    }
  },

  /**
   * Get doctor by ID
   * GET /api/v1/doctors/:id
   */
  getById: async (id: ID): Promise<Doctor> => {
    try {
      const response = await httpClient.get<DoctorResponse>(`${API_BASE}/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for doctor ${id}, using mock data`);
      const mockDoctor = getMockDoctorById(id);
      if (mockDoctor) {
        return mockDoctor;
      }
      throw new Error('Doctor not found');
    }
  },

  /**
   * Get full doctor profile (with education, reviews, etc.)
   * GET /api/v1/doctors/:id/profile
   */
  getProfile: async (id: ID): Promise<DoctorProfile> => {
    try {
      const response = await httpClient.get<DoctorProfileResponse>(
        `${API_BASE}/${id}/profile`,
      );
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for doctor profile ${id}, using mock data`);
      const mockDoctor = getMockDoctorById(id);
      if (mockDoctor) {
        return {
          ...mockDoctor,
          education: [
            { degree: 'MBBS', institution: 'Medical College', year: 2010 },
            { degree: 'MD', institution: 'Post Graduate Institute', year: 2014 },
          ],
          experienceDetails: [
            { position: 'Senior Resident', hospital: 'City Hospital', fromYear: 2015, toYear: 2018 },
            { position: 'Consultant', hospital: 'MediTrack Hospital', fromYear: 2018, current: true },
          ],
          specialties: [mockDoctor.specialization],
          services: ['Consultation', 'Follow-up', 'Emergency'],
          consultationModes: ['in-person', 'video'],
        } as DoctorProfile;
      }
      throw new Error('Doctor profile not found');
    }
  },

  /**
   * Get doctor reviews
   * GET /api/v1/doctors/:id/reviews
   */
  getReviews: async (
    id: ID,
    params?: { page?: number; limit?: number },
  ): Promise<DoctorReviewsResponse> => {
    try {
      const response = await httpClient.get<DoctorReviewsResponse>(
        `${API_BASE}/${id}/reviews`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.warn(`API failed for doctor reviews ${id}, using mock data`);
      return {
        success: true,
        data: [
          {
            id: 'rev-001',
            patientId: 'pat-001',
            patientName: 'John Doe',
            rating: 5,
            review: 'Excellent doctor! Very knowledgeable and caring.',
            helpful: 45,
            repliedByDoctor: true,
            reply: 'Thank you for your kind words!',
            repliedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'rev-002',
            patientId: 'pat-002',
            patientName: 'Jane Smith',
            rating: 4,
            review: 'Good experience. Doctor listened to all my concerns.',
            helpful: 32,
            repliedByDoctor: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: 2,
          totalPages: 1,
        },
      };
    }
  },

  /**
   * Get available slots for a doctor on a specific date
   * GET /api/v1/doctors/:id/slots?date=YYYY-MM-DD
   */
  getAvailableSlots: async (id: ID, date: string): Promise<string[]> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: string[] }>(
        `${API_BASE}/${id}/slots`,
        { params: { date } },
      );
      return response.data.data;
    } catch (error) {
      console.warn(`API failed for slots, using mock data for doctor ${id}`);
      // Mock slots - 9 AM to 5 PM
      return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    }
  },

  /**
   * Get patient's favourite doctors
   * GET /api/v1/patients/me/favourite-doctors
   */
  getFavourites: async (): Promise<Doctor[]> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: Doctor[] }>(
        '/api/v1/patients/me/favourite-doctors',
      );
      return response.data.data;
    } catch (error) {
      console.warn('API failed for favourites, using mock data');
      const mockDoctors = generateMockDoctors();
      return mockDoctors.slice(0, 2);
    }
  },

  /**
   * Add doctor to favourites
   * POST /api/v1/patients/me/favourite-doctors/:doctorId
   */
  addFavourite: async (doctorId: ID): Promise<void> => {
    try {
      await httpClient.post(`/api/v1/patients/me/favourite-doctors/${doctorId}`);
    } catch (error) {
      console.warn(`API failed for add favourite ${doctorId}, simulating success`);
      // Mock success
      return;
    }
  },

  /**
   * Remove doctor from favourites
   * DELETE /api/v1/patients/me/favourite-doctors/:doctorId
   */
  removeFavourite: async (doctorId: ID): Promise<void> => {
    try {
      await httpClient.delete(`/api/v1/patients/me/favourite-doctors/${doctorId}`);
    } catch (error) {
      console.warn(`API failed for remove favourite ${doctorId}, simulating success`);
      // Mock success
      return;
    }
  },

  /**
   * Toggle favourite status (helper combining add/remove)
   */
  toggleFavourite: async (doctorId: ID, currentlyFavourite: boolean): Promise<void> => {
    if (currentlyFavourite) {
      await doctorService.removeFavourite(doctorId);
    } else {
      await doctorService.addFavourite(doctorId);
    }
  },

} as const;

export default doctorService;