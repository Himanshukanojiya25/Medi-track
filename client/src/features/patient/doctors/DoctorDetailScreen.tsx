// client/src/features/patient/doctors/DoctorDetailScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Award,
  Clock,
  Calendar,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Heart,
  Briefcase,
  GraduationCap,
  Languages,
  Video,
  MessageCircle,
  CreditCard,
  ThumbsUp,
  Flag,
  Share2,
  Users,
} from 'lucide-react';
// ============================================================
// TODO: UNCOMMENT WHEN BACKEND IS READY
// ============================================================
// import { doctorService } from '../../services/doctor.service';
// import { favoriteService } from '../../services/favorite.service';
import { DoctorStatus, DoctorSpeciality, ConsultationFeeType, getSpecialityDisplay, formatConsultationFee } from '../../../types/patient/doctor.types';
import type { Doctor, DoctorProfile, DoctorReview } from '../../../types/patient/doctor.types';

// ============================================================================
// MOCK DATA GENERATORS (Remove when backend ready)
// ============================================================================

const generateMockDoctorProfile = (id: string): DoctorProfile => {
  const baseDoctor: Doctor = {
    id: id,
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
    bio: 'Dr. Sarah Johnson is a renowned cardiologist with over 12 years of experience in treating complex heart conditions. She specializes in interventional cardiology and has performed over 5000 successful procedures. Her approach combines cutting-edge medical technology with compassionate patient care. She believes in preventive cardiology and works closely with patients to develop long-term heart health strategies.',
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
  };

  return {
    ...baseDoctor,
    education: [
      { degree: 'MBBS', institution: 'King Edward Memorial Hospital', year: 2008 },
      { degree: 'MD Cardiology', institution: 'All India Institute of Medical Sciences', year: 2012 },
      { degree: 'DM Cardiology', institution: 'Christian Medical College', year: 2016 },
    ],
    experienceDetails: [
      { position: 'Junior Resident', hospital: 'KEM Hospital', fromYear: 2008, toYear: 2010 },
      { position: 'Senior Resident', hospital: 'AIIMS Delhi', fromYear: 2012, toYear: 2015 },
      { position: 'Consultant Cardiologist', hospital: 'MediCare Hospital', fromYear: 2016, current: true },
    ],
    specialties: ['Interventional Cardiology', 'Heart Failure', 'Preventive Cardiology'],
    services: ['ECG', 'Echocardiography', 'Stress Test', 'Holter Monitoring'],
    averageWaitTime: 15,
    consultationModes: ['in-person', 'video'],
    insuranceAccepted: ['Star Health', 'ICICI Lombard', 'HDFC Ergo'],
  };
};

const generateMockReviews = (doctorId: string): DoctorReview[] => {
  return [
    {
      id: 'rev-001',
      patientId: 'pat-001',
      patientName: 'Rajesh Kumar',
      patientAvatar: '',
      rating: 5,
      review: 'Excellent doctor! Very knowledgeable and caring. Explained everything in detail. Highly recommended!',
      helpful: 45,
      isVerifiedPurchase: true,
      repliedByDoctor: true,
      reply: 'Thank you for your kind words Mr. Kumar! Always here for your heart health.',
      repliedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rev-002',
      patientId: 'pat-002',
      patientName: 'Priya Sharma',
      patientAvatar: '',
      rating: 5,
      review: 'Dr. Johnson is truly amazing. She took time to understand my condition and prescribed the right treatment.',
      helpful: 32,
      isVerifiedPurchase: true,
      repliedByDoctor: true,
      reply: 'Glad I could help you Priya! Stay healthy.',
      repliedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rev-003',
      patientId: 'pat-003',
      patientName: 'Amit Verma',
      patientAvatar: '',
      rating: 4,
      review: 'Good experience. Doctor was professional and thorough. Slight waiting time though.',
      helpful: 28,
      isVerifiedPurchase: true,
      repliedByDoctor: false,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// ============================================================================
// COMPONENTS
// ============================================================================

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalfStar
              ? 'fill-yellow-400 text-yellow-400 opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <span className="text-blue-600">{icon}</span>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ReviewCard: React.FC<{ review: DoctorReview }> = ({ review }) => (
  <div className="border-b border-gray-100 last:border-0 py-4">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {review.patientName.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{review.patientName}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size={12} />
            <span className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      {review.isVerifiedPurchase && (
        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 size={10} />
          Verified
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 mb-2">{review.review}</p>
    {review.helpful > 0 && (
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <ThumbsUp size={12} />
          Helpful ({review.helpful})
        </button>
        <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
          <Flag size={12} />
          Report
        </button>
      </div>
    )}
    {review.reply && (
      <div className="mt-3 ml-6 pl-3 border-l-2 border-blue-200">
        <p className="text-xs font-medium text-blue-700 mb-1">Dr. Sarah Johnson replied:</p>
        <p className="text-sm text-gray-600">{review.reply}</p>
      </div>
    )}
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
    <div className="h-8 w-24 bg-gray-200 rounded mb-6" />
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-7 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 bg-gray-100 rounded-xl" />
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DoctorDetailScreen: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'availability'>('about');

  // Fetch doctor details
  const fetchDoctorDetails = useCallback(async () => {
    if (!doctorId) return;

    setIsLoading(true);
    setError(null);

    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      const data = await doctorService.getProfile(doctorId);
      setDoctor(data);
      setUseMockData(false);
    } catch (err) {
      console.warn('API failed, using mock data for doctor:', doctorId);
      const mockData = generateMockDoctorProfile(doctorId);
      setDoctor(mockData);
      setUseMockData(true);
    }
    */

    // ============================================================
    // CURRENT: Using mock data only
    // ============================================================
    setTimeout(() => {
      const mockData = generateMockDoctorProfile(doctorId!);
      setDoctor(mockData);
      setUseMockData(true);
      setIsLoading(false);
    }, 500);
  }, [doctorId]);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    if (!doctorId) return;

    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      const response = await doctorService.getReviews(doctorId);
      setReviews(response.data);
    } catch (err) {
      console.warn('API failed, using mock reviews');
      setReviews(generateMockReviews(doctorId));
    }
    */

    // ============================================================
    // CURRENT: Using mock data only
    // ============================================================
    setTimeout(() => {
      setReviews(generateMockReviews(doctorId!));
    }, 300);
  }, [doctorId]);

  // Fetch favorite status
  const fetchFavoriteStatus = useCallback(async () => {
    if (!doctorId) return;

    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      const isFav = await favoriteService.isDoctorFavourite(doctorId);
      setIsFavorite(isFav);
    } catch (err) {
      console.warn('Failed to fetch favorite status:', err);
    }
    */
  }, [doctorId]);

  useEffect(() => {
    fetchDoctorDetails();
    fetchReviews();
    fetchFavoriteStatus();
  }, [fetchDoctorDetails, fetchReviews, fetchFavoriteStatus]);

  const handleFavoriteToggle = useCallback(async () => {
    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      if (isFavorite) {
        await favoriteService.removeFavouriteDoctor(doctorId!);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavouriteDoctor(doctorId!);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
    */
    
    // Mock toggle for now
    setIsFavorite(!isFavorite);
  }, [doctorId, isFavorite]);

  const handleBookAppointment = useCallback(() => {
    navigate(`/patient/appointments/book?doctorId=${doctorId}`);
  }, [doctorId, navigate]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Doctor Profile</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchDoctorDetails}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Mock Data Banner */}
        {useMockData && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Shield size={18} className="text-amber-600" />
            <p className="text-sm text-amber-700 flex-1">
              Demo Mode: Showing sample doctor profile. Backend API integration coming soon.
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Doctors</span>
        </button>

        {/* Doctor Header Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {doctor.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                  {doctor.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                      <Shield size={12} />
                      Verified
                    </span>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doctor.status]}`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
                  {doctor.status}
                </div>
              </div>

              <p className="text-gray-600 mb-2">{getSpecialityDisplay(doctor.specialization)}</p>

              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Award size={14} />
                  {doctor.experience} years exp
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {doctor.rating} ({doctor.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {doctor.totalPatients}+ patients
                </span>
              </div>

              {doctor.hospital && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin size={14} />
                  {doctor.hospital.name}, {doctor.hospital.city}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleBookAppointment}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Book Appointment
                </button>
                <button
                  onClick={handleFavoriteToggle}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Fee Card */}
            <div className="md:text-right">
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="text-2xl font-bold text-gray-900">{formatConsultationFee(doctor.consultationFee, doctor.feeType)}</p>
              {doctor.isAvailableToday && (
                <p className="text-xs text-green-600 mt-1 flex items-center justify-end gap-1">
                  <CheckCircle2 size={12} />
                  Available Today
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-4">
          {[
            { id: 'about', label: 'About', icon: <Briefcase size={16} /> },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={16} /> },
            { id: 'availability', label: 'Availability', icon: <Clock size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <>
            <SectionCard title="About Doctor" icon={<Briefcase size={18} />}>
              <p className="text-gray-600 leading-relaxed mb-4">{doctor.bio}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <InfoRow icon={<GraduationCap size={16} />} label="Education" value={doctor.qualifications.join(', ')} />
                <InfoRow icon={<Languages size={16} />} label="Languages" value={doctor.languages.join(', ')} />
                <InfoRow icon={<Clock size={16} />} label="Avg. Wait Time" value={`${doctor.averageWaitTime} minutes`} />
                <InfoRow icon={<CreditCard size={16} />} label="Insurance Accepted" value={doctor.insuranceAccepted?.join(', ') || 'N/A'} />
              </div>
            </SectionCard>

            <SectionCard title="Experience" icon={<Briefcase size={18} />}>
              <div className="space-y-4">
                {doctor.experienceDetails.map((exp, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-20 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">{exp.fromYear} - {exp.current ? 'Present' : exp.toYear}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{exp.position}</p>
                      <p className="text-sm text-gray-500">{exp.hospital}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Specialties & Services" icon={<Award size={18} />}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map(spec => (
                      <span key={spec} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{spec}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.services.map(service => (
                      <span key={service} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{service}</span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <SectionCard title="Patient Reviews" icon={<Star size={18} />}>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            ) : (
              <div>
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <SectionCard title="Consultation Modes" icon={<Video size={18} />}>
            <div className="space-y-4">
              {doctor.consultationModes.map(mode => (
                <div key={mode} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {mode === 'in-person' && <MapPin size={20} className="text-blue-600" />}
                  {mode === 'video' && <Video size={20} className="text-blue-600" />}
                  {mode === 'phone' && <MessageCircle size={20} className="text-blue-600" />}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{mode}</p>
                    <p className="text-sm text-gray-500">
                      {mode === 'in-person' ? `Visit at ${doctor.hospital?.name}` : 'Available via online consultation'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
          <Phone size={18} className="text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">Need help booking an appointment?</p>
            <p className="text-xs text-blue-600">Call us at +91-1800-XXX-XXXX or email support@meditrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailScreen;