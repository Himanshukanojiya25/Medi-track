// client/src/features/patient/doctors/DoctorCard.tsx
import React from 'react';
import { Star, MapPin, Award, Clock, ChevronRight, Shield } from 'lucide-react';
import type { Doctor } from '../../../types/patient/doctor.types';
import { DoctorStatus, getSpecialityDisplay, formatConsultationFee } from '../../../types/patient/doctor.types';

export interface DoctorCardProps {
  doctor: Doctor;
  isFavorite?: boolean;
  onFavoriteClick?: (doctorId: string) => void;
  onBookClick?: (doctorId: string) => void;
  onViewDetails?: (doctorId: string) => void;
  variant?: 'default' | 'compact';
  showBookButton?: boolean;
  className?: string;
}

const statusColors: Record<DoctorStatus, { bg: string; text: string; dot: string }> = {
  [DoctorStatus.AVAILABLE]: { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50' },
  [DoctorStatus.BUSY]: { bg: '#fff3e0', text: '#ed6c02', dot: '#ff9800' },
  [DoctorStatus.ACTIVE]: { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50' },
  [DoctorStatus.ON_LEAVE]: { bg: '#ffebee', text: '#d32f2f', dot: '#f44336' },
  [DoctorStatus.INACTIVE]: { bg: '#f5f5f5', text: '#757575', dot: '#9e9e9e' },
  [DoctorStatus.SUSPENDED]: { bg: '#ffebee', text: '#d32f2f', dot: '#f44336' },
  [DoctorStatus.OFFLINE]: { bg: '#f5f5f5', text: '#757575', dot: '#9e9e9e' },
  [DoctorStatus.AWAY]: { bg: '#fff3e0', text: '#ed6c02', dot: '#ff9800' },
};

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  isFavorite = false,
  onFavoriteClick,
  onBookClick,
  onViewDetails,
  variant = 'default',
  showBookButton = true,
  className = '',
}) => {
  const statusStyle = statusColors[doctor.status] || statusColors[DoctorStatus.INACTIVE];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
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

  if (variant === 'compact') {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-all cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(doctor.id)}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {doctor.name.charAt(0)}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{doctor.name}</h4>
              {doctor.isVerified && (
                <Shield size={12} className="text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">{getSpecialityDisplay(doctor.specialization)}</p>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(doctor.rating)}
              <span className="text-xs text-gray-600">({doctor.totalReviews})</span>
            </div>
          </div>
          
          {/* Fee & Book */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{formatConsultationFee(doctor.consultationFee, doctor.feeType)}</p>
            {showBookButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookClick?.(doctor.id);
                }}
                className="mt-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all cursor-pointer ${className}`}
      onClick={() => onViewDetails?.(doctor.id)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
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
            <div className={`px-2 py-1 rounded-full text-xs font-medium`} style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1`} style={{ backgroundColor: statusStyle.dot }} />
              {doctor.status}
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
          
          <div className="flex items-center gap-3 mb-3">
            {renderStars(doctor.rating)}
            <span className="text-sm text-gray-600">({doctor.totalReviews} reviews)</span>
          </div>
          
          {doctor.bio && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{doctor.bio}</p>
          )}
          
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
                    isFavorite 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
              
              {showBookButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookClick?.(doctor.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(doctor.id);
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