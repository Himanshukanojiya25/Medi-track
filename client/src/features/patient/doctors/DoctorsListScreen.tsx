// client/src/features/patient/doctors/DoctorsListScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Shield, 
  Search, 
  X, 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  Heart, 
  ChevronRight,
  Users
} from 'lucide-react';
// ============================================================
// TODO: UNCOMMENT WHEN BACKEND IS READY
// ============================================================
// import { doctorService } from '../../services/doctor.service';
// import { favoriteService } from '../../services/favorite.service';
import { 
  DoctorSpeciality, 
  DoctorStatus, 
  ConsultationFeeType,
  getSpecialityDisplay, 
  formatConsultationFee 
} from '../../../types/patient/doctor.types';
import type { Doctor } from '../../../types/patient/doctor.types';

// ============================================================================
// MOCK DATA (Using CORRECT enums)
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
      qualifications: ['MD Cardiology', 'MBBS', 'DM Cardiology'],
      experience: 12,
      languages: ['English', 'Hindi'],
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
      consultationFee: 1500,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.9,
      totalReviews: 128,
      totalPatients: 450,
      status: DoctorStatus.AVAILABLE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
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
      bio: 'Leading neurologist with expertise in stroke and epilepsy management.',
      consultationFee: 2000,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.8,
      totalReviews: 95,
      totalPatients: 320,
      status: DoctorStatus.AVAILABLE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
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
      bio: 'Skin care specialist treating acne, eczema, and cosmetic dermatology.',
      consultationFee: 1200,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.9,
      totalReviews: 210,
      totalPatients: 680,
      status: DoctorStatus.BUSY,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: false,
      hospital: {
        id: 'hos-002',
        name: 'Skin Care Clinic',
        city: 'Delhi',
        state: 'Delhi',
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
      qualifications: ['MS Orthopedics', 'MBBS'],
      experience: 18,
      languages: ['English'],
      bio: 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
      consultationFee: 2500,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.7,
      totalReviews: 156,
      totalPatients: 520,
      status: DoctorStatus.ACTIVE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
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
      bio: 'Compassionate pediatrician caring for children from birth to adolescence.',
      consultationFee: 1000,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.9,
      totalReviews: 178,
      totalPatients: 890,
      status: DoctorStatus.AVAILABLE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-003',
        name: "Children's Health Center",
        city: 'Pune',
        state: 'Maharashtra',
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
      bio: 'General physician with expertise in managing chronic diseases.',
      consultationFee: 800,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.6,
      totalReviews: 234,
      totalPatients: 1200,
      status: DoctorStatus.ON_LEAVE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: false,
      hospital: {
        id: 'hos-001',
        name: 'MediCare Super Speciality Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
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
      qualifications: ['MD Gynecology', 'MBBS'],
      experience: 14,
      languages: ['English', 'Hindi', 'Gujarati'],
      bio: 'Gynecologist and obstetrician providing comprehensive women\'s health services.',
      consultationFee: 1800,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.9,
      totalReviews: 198,
      totalPatients: 750,
      status: DoctorStatus.AVAILABLE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-004',
        name: 'Women Care Hospital',
        city: 'Ahmedabad',
        state: 'Gujarat',
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
      qualifications: ['MS Ophthalmology', 'MBBS'],
      experience: 11,
      languages: ['English', 'Telugu', 'Hindi'],
      bio: 'Eye specialist offering comprehensive eye care including cataract surgery.',
      consultationFee: 1300,
      feeType: ConsultationFeeType.FIXED,  // ✅ Using enum
      rating: 4.8,
      totalReviews: 145,
      totalPatients: 580,
      status: DoctorStatus.AVAILABLE,  // ✅ Using enum
      isVerified: true,
      isAvailableToday: true,
      hospital: {
        id: 'hos-005',
        name: 'Vision Eye Care Center',
        city: 'Hyderabad',
        state: 'Telangana',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const filterMockDoctors = (
  doctors: Doctor[],
  searchTerm: string,
  filters: DoctorFilterState
): Doctor[] => {
  let filtered = [...doctors];
  
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchLower) ||
      getSpecialityDisplay(doc.specialization).toLowerCase().includes(searchLower) ||
      doc.hospital?.name?.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.specialization) {
    filtered = filtered.filter(doc => doc.specialization === filters.specialization);
  }
  
  if (filters.minExperience > 0) {
    filtered = filtered.filter(doc => doc.experience >= filters.minExperience);
  }
  
  if (filters.maxFee < 5000) {
    filtered = filtered.filter(doc => doc.consultationFee <= filters.maxFee);
  }
  
  if (filters.minRating > 0) {
    filtered = filtered.filter(doc => doc.rating >= filters.minRating);
  }
  
  if (filters.availableToday) {
    filtered = filtered.filter(doc => doc.isAvailableToday === true);
  }
  
  return filtered;
};

// ============================================================================
// TYPES
// ============================================================================

interface DoctorFilterState {
  specialization: string;
  minExperience: number;
  maxFee: number;
  minRating: number;
  availableToday: boolean;
}

// ============================================================================
// DOCTOR CARD COMPONENT
// ============================================================================

const DoctorCard: React.FC<{
  doctor: Doctor;
  onBookClick: (doctorId: string) => void;
  onViewDetails: (doctorId: string) => void;
  onFavoriteClick?: (doctorId: string) => void;
  isFavorite?: boolean;
}> = ({ doctor, onBookClick, onViewDetails, onFavoriteClick, isFavorite = false }) => {
  const statusColors: Record<DoctorStatus, string> = {
    [DoctorStatus.AVAILABLE]: 'bg-green-100 text-green-700',
    [DoctorStatus.BUSY]: 'bg-orange-100 text-orange-700',
    [DoctorStatus.ACTIVE]: 'bg-green-100 text-green-700',
    [DoctorStatus.ON_LEAVE]: 'bg-red-100 text-red-700',
    [DoctorStatus.INACTIVE]: 'bg-gray-100 text-gray-700',
    [DoctorStatus.SUSPENDED]: 'bg-red-100 text-red-700',
    [DoctorStatus.OFFLINE]: 'bg-gray-100 text-gray-700',
    [DoctorStatus.AWAY]: 'bg-yellow-100 text-yellow-700',
  };

  const statusDisplay = doctor.status.toString();

  return (
    <div
      onClick={() => onViewDetails(doctor.id)}
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {doctor.name.charAt(0)}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
              {doctor.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                  <Shield size={10} />
                  Verified
                </span>
              )}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doctor.status] || 'bg-gray-100 text-gray-700'}`}>
              {statusDisplay}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-1">{getSpecialityDisplay(doctor.specialization)}</p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Award size={12} />
              {doctor.experience} years exp
            </span>
            {doctor.hospital && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {doctor.hospital.name}
              </span>
            )}
            {!doctor.isAvailableToday && (
              <span className="flex items-center gap-1 text-orange-600">
                <Clock size={12} />
                Not available today
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({doctor.totalReviews} reviews)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Consultation Fee</p>
              <p className="text-lg font-bold text-gray-900">{formatConsultationFee(doctor.consultationFee, doctor.feeType)}</p>
            </div>
            
            <div className="flex gap-2">
              {onFavoriteClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteClick(doctor.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookClick(doctor.id);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(doctor.id);
                }}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SKELETON LOADER
// ============================================================================

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN SCREEN
// ============================================================================

export const DoctorsListScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<DoctorFilterState>({
    specialization: '',
    minExperience: 0,
    maxFee: 5000,
    minRating: 0,
    availableToday: false,
  });

  // Load doctors (Mock data for now)
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      
      // ============================================================
      // TODO: UNCOMMENT THIS BLOCK WHEN BACKEND IS READY
      // ============================================================
      /*
      try {
        const response = await doctorService.list();
        setDoctors(response.data);
        setUseMockData(false);
      } catch (error) {
        console.warn('API failed, using mock data');
        const mockDoctors = generateMockDoctors();
        setDoctors(mockDoctors);
        setUseMockData(true);
      }
      */
      
      // ============================================================
      // CURRENT: Using mock data only (Remove when backend ready)
      // ============================================================
      setTimeout(() => {
        const mockDoctors = generateMockDoctors();
        setDoctors(mockDoctors);
        setUseMockData(true);
        setIsLoading(false);
      }, 800);
    };
    
    loadDoctors();
    
    // ============================================================
    // TODO: UNCOMMENT TO LOAD FAVORITES FROM BACKEND
    // ============================================================
    /*
    const loadFavorites = async () => {
      try {
        const favorites = await favoriteService.getFavouriteDoctors();
        setFavoriteIds(new Set(favorites.map(f => f.id)));
      } catch (error) {
        console.warn('Failed to load favorites');
      }
    };
    loadFavorites();
    */
    
    // Mock favorites for demo
    setFavoriteIds(new Set(['doc-001', 'doc-005']));
  }, []);

  // Filter doctors
  useEffect(() => {
    const filtered = filterMockDoctors(doctors, searchTerm, filters);
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, filters]);

  const handleFavoriteToggle = (doctorId: string) => {
    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    if (favoriteIds.has(doctorId)) {
      await favoriteService.removeFavouriteDoctor(doctorId);
    } else {
      await favoriteService.addFavouriteDoctor(doctorId);
    }
    */
    
    // Mock toggle for now
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(doctorId)) {
        newSet.delete(doctorId);
      } else {
        newSet.add(doctorId);
      }
      return newSet;
    });
  };

  const handleBookClick = (doctorId: string) => {
    navigate(`/patient/appointments/book?doctorId=${doctorId}`);
  };

  const handleViewDetails = (doctorId: string) => {
    navigate(`/patient/doctors/${doctorId}`);
  };

  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      minExperience: 0,
      maxFee: 5000,
      minRating: 0,
      availableToday: false,
    });
    setSearchTerm('');
  };

  const activeFiltersCount = [
    filters.specialization,
    filters.minExperience > 0,
    filters.maxFee < 5000,
    filters.minRating > 0,
    filters.availableToday,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .doctors-list-wrap { animation: fadeIn 0.3s ease; }
      `}</style>

      <div className="doctors-list-wrap min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          
          {/* Mock Data Banner */}
          {useMockData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Shield size={18} className="text-amber-600" />
              <p className="text-sm text-amber-700 flex-1">
                Demo Mode: Showing sample doctors. Backend API integration coming soon.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
              <p className="text-sm text-gray-500">Book appointments with top specialists</p>
            </div>
          </div>

          {/* Search Bar - Added Search import fix */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name, specialization, or hospital..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <select
                value={filters.specialization}
                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {Object.values(DoctorSpeciality).map(spec => (
                  <option key={spec} value={spec}>{getSpecialityDisplay(spec)}</option>
                ))}
              </select>

              <select
                value={filters.minExperience}
                onChange={(e) => setFilters({ ...filters, minExperience: Number(e.target.value) })}
                className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Any Experience</option>
                <option value={3}>3+ years</option>
                <option value={5}>5+ years</option>
                <option value={10}>10+ years</option>
                <option value={15}>15+ years</option>
              </select>

              <select
                value={filters.maxFee}
                onChange={(e) => setFilters({ ...filters, maxFee: Number(e.target.value) })}
                className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5000}>Any Fee</option>
                <option value={1000}>Up to ₹1,000</option>
                <option value={1500}>Up to ₹1,500</option>
                <option value={2000}>Up to ₹2,000</option>
                <option value={2500}>Up to ₹2,500</option>
              </select>

              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3★ & above</option>
                <option value={3.5}>3.5★ & above</option>
                <option value={4}>4★ & above</option>
                <option value={4.5}>4.5★ & above</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={filters.availableToday}
                  onChange={(e) => setFilters({ ...filters, availableToday: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available Today</span>
              </label>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Doctor List */}
          {isLoading ? (
            <SkeletonLoader />
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isFavorite={favoriteIds.has(doctor.id)}
                  onFavoriteClick={handleFavoriteToggle}
                  onBookClick={handleBookClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorsListScreen;