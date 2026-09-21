// client/src/features/patient/doctors/mockData.ts
import type { Doctor } from '../../../types/patient/doctor.types';
import { DoctorSpeciality, DoctorStatus, ConsultationFeeType } from '../../../types/patient/doctor.types';

export const generateMockDoctors = (): Doctor[] => {
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
      qualifications: ['MD Cardiology', 'MBBS', 'DM Cardiology'],
      experience: 12,
      languages: ['English', 'Hindi'],
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment. Fellowship trained in Interventional Cardiology.',
      consultationFee: 1500,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.9,
      totalReviews: 128,
      totalPatients: 450,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
      },
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
      bio: 'Leading neurologist with expertise in stroke and epilepsy management. Published over 50 research papers.',
      consultationFee: 2000,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.8,
      totalReviews: 95,
      totalPatients: 320,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
      },
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
      bio: 'Skin care specialist treating acne, eczema, and cosmetic dermatology. Certified in laser procedures.',
      consultationFee: 1200,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.9,
      totalReviews: 210,
      totalPatients: 680,
      status: DoctorStatus.BUSY,
      isVerified: true,
      isAvailableToday: false,
      hospital: {
        id: 'hos-002',
        name: 'Skin Care Clinic',
        city: 'Delhi',
        state: 'Delhi',
        rating: 4.7,
      },
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
      qualifications: ['MS Orthopedics', 'MBBS', 'Fellowship Joint Replacement'],
      experience: 18,
      languages: ['English'],
      bio: 'Orthopedic surgeon specializing in joint replacement and sports injuries. Performed 5000+ successful surgeries.',
      consultationFee: 2500,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.7,
      totalReviews: 156,
      totalPatients: 520,
      status: DoctorStatus.ACTIVE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
      },
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
      bio: 'Compassionate pediatrician caring for children from birth to adolescence. Special interest in child nutrition.',
      consultationFee: 1000,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.9,
      totalReviews: 178,
      totalPatients: 890,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-003',
        name: "Children's Health Center",
        city: 'Pune',
        state: 'Maharashtra',
        rating: 4.9,
      },
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
      bio: 'General physician with expertise in managing chronic diseases and preventive care. Available for general consultations.',
      consultationFee: 800,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.6,
      totalReviews: 234,
      totalPatients: 1200,
      status: DoctorStatus.ON_LEAVE,
      isVerified: true,
      isAvailableToday: false,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-007',
      userId: 'user-007',
      hospitalId: 'hos-004',
      name: 'Dr. Anita Desai',
      email: 'anita.desai@meditrack.com',
      phone: '+91-98765-43216',
      profilePicture: '',
      specialization: DoctorSpeciality.GYNECOLOGY,
      qualifications: ['MD Gynecology', 'MBBS', 'Fellowship Reproductive Medicine'],
      experience: 14,
      languages: ['English', 'Hindi', 'Gujarati'],
      bio: 'Gynecologist and obstetrician providing comprehensive women\'s health services. Expert in high-risk pregnancies.',
      consultationFee: 1800,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.9,
      totalReviews: 198,
      totalPatients: 750,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-004',
        name: 'Women Care Hospital',
        city: 'Ahmedabad',
        state: 'Gujarat',
        rating: 4.8,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-008',
      userId: 'user-008',
      hospitalId: 'hos-005',
      name: 'Dr. Vikram Reddy',
      email: 'vikram.reddy@meditrack.com',
      phone: '+91-98765-43217',
      profilePicture: '',
      specialization: DoctorSpeciality.OPHTHALMOLOGY,
      qualifications: ['MS Ophthalmology', 'MBBS', 'Fellowship Lasik Surgery'],
      experience: 11,
      languages: ['English', 'Telugu', 'Hindi'],
      bio: 'Eye specialist offering comprehensive eye care including cataract surgery and Lasik procedures.',
      consultationFee: 1300,
      feeType: ConsultationFeeType.FIXED,
      rating: 4.8,
      totalReviews: 145,
      totalPatients: 580,
      status: DoctorStatus.AVAILABLE,
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-005',
        name: 'Vision Eye Care Center',
        city: 'Hyderabad',
        state: 'Telangana',
        rating: 4.7,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const getMockDoctorById = (id: string): Doctor | null => {
  const mockDoctors = generateMockDoctors();
  return mockDoctors.find(doc => doc.id === id) || null;
};

export const filterMockDoctors = (
  doctors: Doctor[],
  filters: {
    search?: string;
    specialization?: string;
    minExperience?: number;
    maxFee?: number;
    minRating?: number;
    availableToday?: boolean;
  }
): Doctor[] => {
  let filtered = [...doctors];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchLower) ||
      doc.specialization.toLowerCase().includes(searchLower) ||
      (doc.hospital?.name?.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.specialization) {
    filtered = filtered.filter(doc => doc.specialization === filters.specialization);
  }
  
  if (filters.minExperience) {
    filtered = filtered.filter(doc => doc.experience >= filters.minExperience!);
  }
  
  if (filters.maxFee) {
    filtered = filtered.filter(doc => doc.consultationFee <= filters.maxFee!);
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(doc => doc.rating >= filters.minRating!);
  }
  
  if (filters.availableToday) {
    filtered = filtered.filter(doc => doc.isAvailableToday === true);
  }
  
  return filtered;
};