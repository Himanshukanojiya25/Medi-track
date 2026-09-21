// client/src/features/patient/appointments/book/BookAppointmentScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, CheckCircle2, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { DoctorSelection } from './DoctorSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { ConfirmBooking } from './ConfirmBooking';
import BookingSuccess from './BookingSuccess';  // ✅ Default import

export type BookingStep = 'doctor' | 'datetime' | 'confirm' | 'success';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profilePicture?: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress?: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  experience: number;
  isAvailableToday: boolean;
}

export interface BookingData {
  doctor: Doctor;
  scheduledDate: Date;
  scheduledTime: string;
  reason?: string;
  type: 'IN_PERSON' | 'VIDEO' | 'PHONE';
}

// Mock doctors data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 1500,
    rating: 4.9,
    totalReviews: 128,
    experience: 12,
    isAvailableToday: true,
  },
  {
    id: 'doc-002',
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 2000,
    rating: 4.8,
    totalReviews: 95,
    experience: 15,
    isAvailableToday: true,
  },
  {
    id: 'doc-003',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    hospitalId: 'hos-002',
    hospitalName: 'Skin Care Clinic',
    hospitalAddress: '45 Beauty Street, Bandra West, Mumbai - 400050',
    consultationFee: 1200,
    rating: 4.9,
    totalReviews: 210,
    experience: 8,
    isAvailableToday: false,
  },
  {
    id: 'doc-004',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 2500,
    rating: 4.7,
    totalReviews: 156,
    experience: 18,
    isAvailableToday: true,
  },
  {
    id: 'doc-005',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    hospitalId: 'hos-003',
    hospitalName: "Children's Health Center",
    hospitalAddress: '78 Child Care Road, Koregaon Park, Pune - 411001',
    consultationFee: 1000,
    rating: 4.9,
    totalReviews: 178,
    experience: 10,
    isAvailableToday: true,
  },
];

const fetchDoctorById = (id: string): Promise<Doctor | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const doctor = MOCK_DOCTORS.find(d => d.id === id) || null;
      resolve(doctor);
    }, 300);
  });
};

const BookAppointmentScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId');

  const [currentStep, setCurrentStep] = useState<BookingStep>('doctor');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load doctor if ID is provided
  useEffect(() => {
    if (initialDoctorId) {
      setIsLoading(true);
      fetchDoctorById(initialDoctorId)
        .then((doctor) => {
          if (doctor) {
            setSelectedDoctor(doctor);
            setCurrentStep('datetime');
          } else {
            setError('Doctor not found');
          }
        })
        .catch(() => setError('Failed to load doctor details'))
        .finally(() => setIsLoading(false));
    }
  }, [initialDoctorId]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep('datetime');
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    if (!selectedDoctor) return;
    
    setBookingData({
      doctor: selectedDoctor,
      scheduledDate: date,
      scheduledTime: time,
      type: 'IN_PERSON',
    });
    setCurrentStep('confirm');
  };

  const handleConfirm = (reason?: string, type?: 'IN_PERSON' | 'VIDEO' | 'PHONE') => {
    if (!bookingData) return;
    
    setBookingData({
      ...bookingData,
      reason,
      type: type || 'IN_PERSON',
    });
    setCurrentStep('success');
  };

  const handleBack = () => {
    if (currentStep === 'doctor') {
      navigate('/patient/doctors');
    } else if (currentStep === 'datetime') {
      setCurrentStep('doctor');
    } else if (currentStep === 'confirm') {
      setCurrentStep('datetime');
    }
  };

  const handleNewBooking = () => {
    setSelectedDoctor(null);
    setBookingData(null);
    setCurrentStep('doctor');
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 20px' }}>
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded-lg mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 20px' }}>
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/patient/doctors')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'success' && bookingData) {
    return <BookingSuccess bookingData={bookingData} onNewBooking={handleNewBooking} />;
  }

  const steps = [
    { id: 'doctor', label: 'Select Doctor', icon: <User size={16} /> },
    { id: 'datetime', label: 'Date & Time', icon: <Calendar size={16} /> },
    { id: 'confirm', label: 'Confirm', icon: <CheckCircle2 size={16} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .fade-in { animation: fadeIn 0.4s ease; }
        .slide-in { animation: slideIn 0.35s ease; }
      `}</style>

      <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: 24,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Book Appointment
          </h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>
            Schedule a consultation with top healthcare specialists
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStepIndex > idx;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 18px',
                      borderRadius: 40,
                      background: isActive 
                        ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                        : isCompleted 
                          ? '#10b981' 
                          : '#f1f5f9',
                      color: isActive || isCompleted ? '#fff' : '#94a3b8',
                      boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : step.icon}
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{step.label}</span>
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        margin: '0 12px',
                        background: isCompleted ? '#10b981' : '#e2e8f0',
                        borderRadius: 2,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="slide-in">
          {currentStep === 'doctor' && (
            <DoctorSelection onSelect={handleDoctorSelect} selectedDoctorId={selectedDoctor?.id} />
          )}

          {currentStep === 'datetime' && selectedDoctor && (
            <DateTimeSelection doctor={selectedDoctor} onSelect={handleDateTimeSelect} />
          )}

          {currentStep === 'confirm' && bookingData && (
            <ConfirmBooking
              bookingData={bookingData}
              onConfirm={handleConfirm}
              onBack={() => setCurrentStep('datetime')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export { BookAppointmentScreen };
export default BookAppointmentScreen;