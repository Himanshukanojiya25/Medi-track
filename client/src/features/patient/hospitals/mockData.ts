// client/src/features/patient/hospitals/mockData.ts

import type { Hospital, HospitalDepartment, HospitalFacility, HospitalTimings } from '../../../types/patient/hospital.types';
import { HospitalType, HospitalStatus } from '../../../types/patient/hospital.types';

const defaultTimings: HospitalTimings = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: { open: '09:00', close: '14:00' },
  sunday: { open: '00:00', close: '00:00' },
  holidays: [],
};

const departments: HospitalDepartment[] = [
  { id: 'dept-001', name: 'Cardiology', description: 'Heart care and treatment', totalDoctors: 12, phone: '022-1234-5601' },
  { id: 'dept-002', name: 'Neurology', description: 'Brain and nervous system', totalDoctors: 8, phone: '022-1234-5602' },
  { id: 'dept-003', name: 'Orthopedics', description: 'Bone and joint care', totalDoctors: 10, phone: '022-1234-5603' },
  { id: 'dept-004', name: 'Pediatrics', description: 'Child healthcare', totalDoctors: 15, phone: '022-1234-5604' },
  { id: 'dept-005', name: 'Gynecology', description: 'Women health', totalDoctors: 9, phone: '022-1234-5605' },
];

const facilities: HospitalFacility[] = [
  { id: 'fac-001', name: '24/7 Emergency', available: true },
  { id: 'fac-002', name: 'Ambulance Service', available: true },
  { id: 'fac-003', name: 'Pharmacy', available: true },
  { id: 'fac-004', name: 'ICU', available: true },
  { id: 'fac-005', name: 'NICU', available: true },
  { id: 'fac-006', name: 'Operation Theaters', available: true },
  { id: 'fac-007', name: 'MRI Center', available: true },
  { id: 'fac-008', name: 'CT Scan', available: true },
  { id: 'fac-009', name: 'Blood Bank', available: true },
  { id: 'fac-010', name: 'Cafeteria', available: true },
  { id: 'fac-011', name: 'Parking', available: true },
  { id: 'fac-012', name: 'Wheelchair Access', available: true },
];

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'hos-001',
    name: 'MediCare Super Speciality Hospital',
    code: 'MCSSH',
    type: HospitalType.SUPER_SPECIALTY,
    status: HospitalStatus.ACTIVE,
    description: 'Leading healthcare provider with state-of-the-art facilities and expert doctors across 50+ specialities.',
    email: 'contact@medicare.com',
    phone: '+91-22-1234-5678',
    emergencyPhone: '+91-22-1234-5600',
    address: {
      street: '123 Healthcare Avenue, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400069',
      country: 'India',
      landmark: 'Near Andheri Station',
      coordinates: { lat: 19.1136, lng: 72.8697 },
    },
    website: 'https://www.medicare.com',
    logo: '',
    coverImage: '',
    rating: 4.8,
    totalReviews: 1250,
    totalDoctors: 150,
    totalDepartments: 25,
    totalBeds: 500,
    availableBeds: 120,
    facilities: facilities,
    departments: departments,
    specialities: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Gynecology', 'Urology', 'Nephrology'],
    opdTimings: defaultTimings,
    emergencyServices: true,
    ambulanceAvailable: true,
    ambulanceContact: '+91-22-1234-5699',
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC Ergo', 'New India Assurance', 'Bajaj Allianz'],
    establishedYear: 2005,
    accreditation: ['NABH', 'NABL', 'JCI'],
    awards: ['Best Multi-Speciality Hospital 2023', 'Patient Safety Award 2022'],
    nearbyLandmarks: ['Andheri Railway Station (1km)', 'International Airport (3km)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hos-002',
    name: 'Apollo Spectra Hospital',
    code: 'ASH',
    type: HospitalType.MULTI_SPECIALTY,
    status: HospitalStatus.ACTIVE,
    description: 'Part of Apollo Hospitals group, known for excellence in healthcare.',
    email: 'contact@apollospectra.com',
    phone: '+91-22-2345-6789',
    emergencyPhone: '+91-22-2345-6700',
    address: {
      street: '45 Health Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      landmark: 'Near Bandra Station',
      coordinates: { lat: 19.0596, lng: 72.8295 },
    },
    website: 'https://www.apollospectra.com',
    logo: '',
    rating: 4.7,
    totalReviews: 980,
    totalDoctors: 120,
    totalDepartments: 18,
    totalBeds: 350,
    availableBeds: 80,
    facilities: facilities.slice(0, 8),
    departments: departments.slice(0, 4),
    specialities: ['Cardiology', 'Orthopedics', 'Neurology', 'Urology', 'Gastroenterology'],
    opdTimings: defaultTimings,
    emergencyServices: true,
    ambulanceAvailable: true,
    ambulanceContact: '+91-22-2345-6799',
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC Ergo'],
    establishedYear: 2010,
    accreditation: ['NABH', 'NABL'],
    awards: ['Excellence in Patient Care 2022'],
    nearbyLandmarks: ['Bandra Station (500m)', 'Bandra Kurla Complex (2km)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hos-003',
    name: 'Fortis Hospital',
    code: 'FH',
    type: HospitalType.MULTI_SPECIALTY,
    status: HospitalStatus.ACTIVE,
    description: 'Part of Fortis Healthcare network, providing comprehensive medical care.',
    email: 'contact@fortis.com',
    phone: '+91-22-3456-7890',
    emergencyPhone: '+91-22-3456-7800',
    address: {
      street: '78 Health Road, Mulund West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400080',
      country: 'India',
      landmark: 'Near Mulund Station',
      coordinates: { lat: 19.1709, lng: 72.9425 },
    },
    website: 'https://www.fortis.com',
    logo: '',
    rating: 4.6,
    totalReviews: 850,
    totalDoctors: 100,
    totalDepartments: 15,
    totalBeds: 300,
    availableBeds: 60,
    facilities: facilities.slice(0, 7),
    departments: departments.slice(0, 3),
    specialities: ['Cardiology', 'Neurology', 'Orthopedics', 'Critical Care'],
    opdTimings: defaultTimings,
    emergencyServices: true,
    ambulanceAvailable: true,
    ambulanceContact: '+91-22-3456-7899',
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'New India Assurance'],
    establishedYear: 2008,
    accreditation: ['NABH', 'NABL'],
    awards: ['Best Critical Care Unit 2021'],
    nearbyLandmarks: ['Mulund Station (800m)', 'Mulund Check Naka (1km)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hos-004',
    name: 'Lilavati Hospital',
    code: 'LH',
    type: HospitalType.SUPER_SPECIALTY,
    status: HospitalStatus.ACTIVE,
    description: 'Premier healthcare institution with world-class infrastructure.',
    email: 'contact@lilavati.com',
    phone: '+91-22-4567-8901',
    emergencyPhone: '+91-22-4567-8900',
    address: {
      street: 'A-791, Bandra Reclamation',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      landmark: 'Near Bandra Worli Sea Link',
      coordinates: { lat: 19.0624, lng: 72.8291 },
    },
    website: 'https://www.lilavati.com',
    logo: '',
    rating: 4.9,
    totalReviews: 2100,
    totalDoctors: 200,
    totalDepartments: 30,
    totalBeds: 600,
    availableBeds: 150,
    facilities: facilities,
    departments: departments,
    specialities: ['Cardiology', 'Neurology', 'Oncology', 'Transplant Surgery', 'Neurosurgery', 'Orthopedics'],
    opdTimings: defaultTimings,
    emergencyServices: true,
    ambulanceAvailable: true,
    ambulanceContact: '+91-22-4567-8999',
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC Ergo', 'New India Assurance', 'Bajaj Allianz', 'Care Health'],
    establishedYear: 1997,
    accreditation: ['NABH', 'NABL', 'JCI'],
    awards: ['Best Hospital in Mumbai 2023', 'Patient Safety Excellence Award'],
    nearbyLandmarks: ['Bandra Worli Sea Link (500m)', 'Shivaji Park (1.5km)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hos-005',
    name: 'Kokilaben Hospital',
    code: 'KDH',
    type: HospitalType.SUPER_SPECIALTY,
    status: HospitalStatus.ACTIVE,
    description: 'One of India\'s most advanced multi-specialty hospitals.',
    email: 'contact@kokilaben.com',
    phone: '+91-22-5678-9012',
    emergencyPhone: '+91-22-5678-9011',
    address: {
      street: 'Rao Saheb Achutrao Patwardhan Marg',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400053',
      country: 'India',
      landmark: 'Near Four Bungalows',
      coordinates: { lat: 19.1717, lng: 72.8393 },
    },
    website: 'https://www.kokilaben.com',
    logo: '',
    rating: 4.8,
    totalReviews: 1750,
    totalDoctors: 180,
    totalDepartments: 28,
    totalBeds: 550,
    availableBeds: 130,
    facilities: facilities,
    departments: departments,
    specialities: ['Cardiology', 'Neurology', 'Oncology', 'Bone Marrow Transplant', 'Robotic Surgery'],
    opdTimings: defaultTimings,
    emergencyServices: true,
    ambulanceAvailable: true,
    ambulanceContact: '+91-22-5678-9099',
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC Ergo', 'New India Assurance'],
    establishedYear: 2009,
    accreditation: ['NABH', 'NABL', 'JCI'],
    awards: ['Most Advanced Hospital in Western India', 'Green Hospital Award'],
    nearbyLandmarks: ['Four Bungalows (300m)', 'Juhu Beach (2km)'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_HOSPITAL_DETAIL = MOCK_HOSPITALS[0];

export const filterMockHospitals = (
  hospitals: Hospital[],
  searchTerm: string,
  filters: HospitalFilterState
): Hospital[] => {
  let filtered = [...hospitals];
  
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(searchLower) ||
      h.city.toLowerCase().includes(searchLower) ||
      h.specialities.some(s => s.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.city) {
    filtered = filtered.filter(h => h.city === filters.city);
  }
  
  if (filters.speciality) {
    filtered = filtered.filter(h => h.specialities.includes(filters.speciality));
  }
  
  if (filters.minRating > 0) {
    filtered = filtered.filter(h => h.rating >= filters.minRating);
  }
  
  if (filters.emergencyServices) {
    filtered = filtered.filter(h => h.emergencyServices === true);
  }
  
  return filtered;
};

export interface HospitalFilterState {
  city: string;
  speciality: string;
  minRating: number;
  emergencyServices: boolean;
}

export const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'];
export const specialities = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Oncology', 'Urology', 'Nephrology'];