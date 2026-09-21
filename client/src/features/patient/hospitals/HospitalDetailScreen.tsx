// client/src/features/patient/hospitals/HospitalDetailScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
  Building2,
  Users,
  Stethoscope,
  Heart,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Share2,
  ThumbsUp,
  Flag,
  Award,
  CreditCard,
  Ambulance,
//   Parking,
  Coffee,
  Wifi,
//   Wheelchair,
  Scissors,
  Activity,
  Thermometer,
  XCircle,
  ChevronRight,
  ExternalLink,
  Info,
  Video,
  MessageCircle,
} from 'lucide-react';
import { MOCK_HOSPITALS } from './mockData';
import type { Hospital, HospitalDepartment, HospitalFacility, HospitalReview } from '../../../types/patient/hospital.types';
import { HospitalType, HospitalStatus } from '../../../types/patient/hospital.types';

// ============================================================================
// MOCK REVIEWS (to avoid circular dependency)
// ============================================================================

const generateMockReviews = (hospitalId: string): HospitalReview[] => {
  return [
    {
      id: 'rev-001',
      patientId: 'pat-001',
      patientName: 'Rajesh Kumar',
      patientAvatar: '',
      rating: 5,
      review: 'Excellent hospital! Very clean, staff is courteous, doctors are knowledgeable. Highly recommended!',
      tags: ['Clean', 'Professional', 'Affordable'],
      helpful: 45,
      reply: 'Thank you for your kind words Mr. Kumar! We strive to provide the best care.',
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
      review: 'Had a great experience. The emergency services are top-notch. Took care of my father very well.',
      tags: ['Emergency Care', 'Good Doctors'],
      helpful: 32,
      reply: 'Glad we could help! Wishing your father good health.',
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
      review: 'Good hospital but waiting time could be better. Otherwise doctors are great.',
      tags: ['Good Treatment', 'Long Wait'],
      helpful: 28,
      repliedByDoctor: false,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rev-004',
      patientId: 'pat-004',
      patientName: 'Neha Gupta',
      patientAvatar: '',
      rating: 5,
      review: 'The best hospital in the city! Modern infrastructure, caring staff, and excellent doctors.',
      tags: ['Modern', 'Clean', 'Professional'],
      helpful: 56,
      reply: 'Thank you for your wonderful feedback!',
      repliedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
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
  valueColor?: string;
}> = ({ icon, label, value, valueColor }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}> = ({ title, icon, children, accent = '#2563eb' }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <span className="text-blue-600">{icon}</span>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ReviewCard: React.FC<{ review: HospitalReview }> = ({ review }) => (
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
      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
        <CheckCircle2 size={10} />
        Verified
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{review.review}</p>
    {review.tags && review.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-2">
        {review.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
    )}
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
        <p className="text-xs font-medium text-blue-700 mb-1">Hospital Management replied:</p>
        <p className="text-sm text-gray-600">{review.reply}</p>
      </div>
    )}
  </div>
);

const FacilityIcon: React.FC<{ name: string }> = ({ name }) => {
  const iconMap: Record<string, React.ReactNode> = {
    '24/7 Emergency': <Heart size={16} />,
    'Ambulance Service': <Ambulance size={16} />,
    // 'Parking': <Parking size={16} />,
    'Cafeteria': <Coffee size={16} />,
    'Wifi': <Wifi size={16} />,
    // 'Wheelchair Access': <Wheelchair size={16} />,
    'Pharmacy': <Activity size={16} />,
    'ICU': <Activity size={16} />,
    'Operation Theaters': <Scissors size={16} />,
    'MRI Center': <Activity size={16} />,
    'CT Scan': <Activity size={16} />,
    'Blood Bank': <Heart size={16} />,
  };
  return iconMap[name] || <CheckCircle2 size={16} />;
};

const SkeletonLoader: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
    <div className="h-8 w-24 bg-gray-200 rounded mb-6" />
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex gap-6">
        <div className="w-24 h-24 rounded-xl bg-gray-200" />
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

export const HospitalDetailScreen: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [reviews, setReviews] = useState<HospitalReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'doctors' | 'reviews' | 'facilities'>('overview');

  // Fetch hospital details
  const fetchHospitalDetails = useCallback(async () => {
    if (!hospitalId) return;

    setIsLoading(true);
    setError(null);

    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      const data = await hospitalService.getById(hospitalId);
      setHospital(data);
      setUseMockData(false);
    } catch (err) {
      console.warn('API failed, using mock data');
      const mockData = MOCK_HOSPITALS.find(h => h.id === hospitalId) || MOCK_HOSPITALS[0];
      setHospital(mockData);
      setUseMockData(true);
    }
    */

    // CURRENT: Using mock data only
    setTimeout(() => {
      const mockData = MOCK_HOSPITALS.find(h => h.id === hospitalId) || MOCK_HOSPITALS[0];
      setHospital(mockData);
      setReviews(generateMockReviews(hospitalId));
      setUseMockData(true);
      setIsLoading(false);
    }, 500);
  }, [hospitalId]);

  useEffect(() => {
    fetchHospitalDetails();
  }, [fetchHospitalDetails]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }, []);

  const handleBookAppointment = useCallback(() => {
    navigate(`/patient/appointments/book?hospitalId=${hospitalId}`);
  }, [hospitalId, navigate]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error && !hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Hospital Profile</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchHospitalDetails}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hospital) return null;

  const typeColors: Record<HospitalType, string> = {
    [HospitalType.GENERAL]: 'bg-green-100 text-green-700',
    [HospitalType.SPECIALTY]: 'bg-blue-100 text-blue-700',
    [HospitalType.MULTI_SPECIALTY]: 'bg-purple-100 text-purple-700',
    [HospitalType.SUPER_SPECIALTY]: 'bg-amber-100 text-amber-700',
    [HospitalType.TEACHING]: 'bg-indigo-100 text-indigo-700',
    [HospitalType.RESEARCH]: 'bg-cyan-100 text-cyan-700',
    [HospitalType.CLINIC]: 'bg-pink-100 text-pink-700',
  };

  const statusColors: Record<HospitalStatus, string> = {
    [HospitalStatus.ACTIVE]: 'bg-green-100 text-green-700',
    [HospitalStatus.INACTIVE]: 'bg-gray-100 text-gray-700',
    [HospitalStatus.SUSPENDED]: 'bg-red-100 text-red-700',
    [HospitalStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Mock Data Banner */}
        {useMockData && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Shield size={18} className="text-amber-600" />
            <p className="text-sm text-amber-700 flex-1">
              Demo Mode: Showing sample hospital profile. Backend API integration coming soon.
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/patient/hospitals')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Hospitals</span>
        </button>

        {/* Hospital Header Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo/Avatar */}
            <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {hospital.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[hospital.type]}`}>
                    {hospital.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[hospital.status]}`}>
                    {hospital.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <MapPin size={14} />
                {hospital.address.street}, {hospital.address.city}, {hospital.address.state} - {hospital.address.postalCode}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {hospital.rating} ({hospital.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  Est. {hospital.establishedYear}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {hospital.totalDoctors}+ Doctors
                </span>
                <span className="flex items-center gap-1">
                  <Stethoscope size={14} />
                  {hospital.totalBeds} Beds
                </span>
              </div>

              {hospital.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hospital.description}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBookAppointment}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Book Appointment
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Emergency Badge */}
            {hospital.emergencyServices && (
              <div className="md:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                  <Heart size={16} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-600">24/7 Emergency</span>
                </div>
                {hospital.ambulanceAvailable && (
                  <p className="text-xs text-gray-500 mt-2">Ambulance: {hospital.ambulanceContact}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <Info size={16} /> },
            { id: 'departments', label: 'Departments', icon: <Building2 size={16} /> },
            { id: 'facilities', label: 'Facilities', icon: <Activity size={16} /> },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={16} /> },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <SectionCard title="About Hospital" icon={<Info size={18} />}>
              <p className="text-gray-600 leading-relaxed mb-4">{hospital.description}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <InfoRow icon={<Calendar size={16} />} label="Established" value={hospital.establishedYear?.toString() || '—'} />
                <InfoRow icon={<Award size={16} />} label="Accreditation" value={hospital.accreditation?.join(', ') || '—'} />
                <InfoRow icon={<CreditCard size={16} />} label="Insurance Accepted" value={hospital.insuranceAccepted?.slice(0, 3).join(', ') + (hospital.insuranceAccepted?.length > 3 ? '...' : '') || '—'} />
                <InfoRow icon={<Globe size={16} />} label="Website" value={hospital.website ? <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Visit Website <ExternalLink size={12} /></a> : '—'} />
              </div>
            </SectionCard>

            <SectionCard title="Contact Information" icon={<Phone size={18} />}>
              <InfoRow icon={<Phone size={16} />} label="Phone" value={hospital.phone} />
              <InfoRow icon={<Mail size={16} />} label="Email" value={hospital.email} />
              {hospital.emergencyPhone && (
                <InfoRow icon={<Heart size={16} />} label="Emergency" value={hospital.emergencyPhone} valueColor="#dc2626" />
              )}
              <InfoRow icon={<MapPin size={16} />} label="Address" value={`${hospital.address.street}, ${hospital.address.city}, ${hospital.address.state} - ${hospital.address.postalCode}`} />
            </SectionCard>

            {hospital.awards && hospital.awards.length > 0 && (
              <SectionCard title="Awards & Recognition" icon={<Award size={18} />}>
                <div className="space-y-2">
                  {hospital.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Award size={14} className="text-yellow-500" />
                      {award}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <SectionCard title="Departments" icon={<Building2 size={18} />}>
            {hospital.departments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No department information available.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {hospital.departments.map(dept => (
                  <div key={dept.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">{dept.name}</h4>
                    {dept.description && <p className="text-xs text-gray-500 mb-2">{dept.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {dept.totalDoctors} Doctors
                      </span>
                      {dept.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {dept.phone}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <SectionCard title="Facilities & Services" icon={<Activity size={18} />}>
            {hospital.facilities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No facility information available.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {hospital.facilities.map(facility => (
                  <div key={facility.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${facility.available ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                      <FacilityIcon name={facility.name} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{facility.name}</p>
                      {facility.description && <p className="text-xs text-gray-500">{facility.description}</p>}
                    </div>
                    {facility.available && (
                      <CheckCircle2 size={14} className="text-green-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <SectionCard title="Patient Reviews" icon={<Star size={18} />}>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            ) : (
              <div>
                {/* Rating Summary */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900">{hospital.rating}</p>
                      <StarRating rating={hospital.rating} size={16} />
                      <p className="text-xs text-gray-500 mt-1">Based on {hospital.totalReviews} reviews</p>
                    </div>
                  </div>
                </div>
                
                {/* Reviews List */}
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
          <Phone size={18} className="text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">Need help booking an appointment?</p>
            <p className="text-xs text-blue-600">Call us at {hospital.emergencyPhone || '+91-1800-XXX-XXXX'} or email support@meditrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetailScreen;