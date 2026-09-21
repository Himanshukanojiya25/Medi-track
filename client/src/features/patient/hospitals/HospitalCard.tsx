// client/src/features/patient/hospitals/HospitalCard.tsx

import React from 'react';
import { Star, MapPin, Building2, Users, Stethoscope, Phone, ChevronRight, Shield, Heart } from 'lucide-react';
import type { Hospital } from '../../../types/patient/hospital.types';
import { HospitalType } from '../../../types/patient/hospital.types';

interface HospitalCardProps {
  hospital: Hospital;
  isFavorite?: boolean;
  onFavoriteClick?: (hospitalId: string) => void;
  onBookClick?: (hospitalId: string) => void;
  onViewDetails?: (hospitalId: string) => void;
  variant?: 'default' | 'compact';
  showBookButton?: boolean;
  className?: string;
}

const typeColors: Record<HospitalType, { bg: string; text: string }> = {
  [HospitalType.GENERAL]: { bg: '#e0e7ff', text: '#4338ca' },
  [HospitalType.SPECIALTY]: { bg: '#dbeafe', text: '#1d4ed8' },
  [HospitalType.MULTI_SPECIALTY]: { bg: '#dcfce7', text: '#166534' },
  [HospitalType.SUPER_SPECIALTY]: { bg: '#fed7aa', text: '#9a3412' },
  [HospitalType.TEACHING]: { bg: '#f3e8ff', text: '#6b21a8' },
  [HospitalType.RESEARCH]: { bg: '#cffafe', text: '#155e75' },
  [HospitalType.CLINIC]: { bg: '#fef3c7', text: '#b45309' },
};

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isFavorite = false,
  onFavoriteClick,
  onBookClick,
  onViewDetails,
  variant = 'default',
  showBookButton = true,
  className = '',
}) => {
  const typeColor = typeColors[hospital.type] || typeColors[HospitalType.GENERAL];

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
        onClick={() => onViewDetails?.(hospital.id)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {hospital.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{hospital.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {renderStars(hospital.rating)}
              <span className="text-xs text-gray-500">({hospital.totalReviews})</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{hospital.city}, {hospital.state}</p>
          </div>
          {showBookButton && (
            <button
              onClick={(e) => { e.stopPropagation(); onBookClick?.(hospital.id); }}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all cursor-pointer ${className}`}
      onClick={() => onViewDetails?.(hospital.id)}
    >
      <div className="flex gap-4">
        {/* Logo/Avatar */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {hospital.name.charAt(0)}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">{hospital.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: typeColor.bg, color: typeColor.text }}>
                {hospital.type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{hospital.rating}</span>
              {renderStars(hospital.rating)}
              <span className="text-xs text-gray-500">({hospital.totalReviews})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin size={14} />
            <span>{hospital.city}, {hospital.state}</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 size={12} />
              {hospital.totalDepartments} Departments
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {hospital.totalDoctors}+ Doctors
            </span>
            <span className="flex items-center gap-1">
              <Stethoscope size={12} />
              {hospital.totalBeds} Beds
            </span>
            {hospital.emergencyServices && (
              <span className="flex items-center gap-1 text-red-600">
                <Heart size={12} />
                24/7 Emergency
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {hospital.specialities.slice(0, 3).map(spec => (
              <span key={spec} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {spec}
              </span>
            ))}
            {hospital.specialities.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{hospital.specialities.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone size={12} />
              <span>{hospital.phone}</span>
            </div>
            
            <div className="flex gap-2">
              {onFavoriteClick && (
                <button
                  onClick={(e) => { e.stopPropagation(); onFavoriteClick(hospital.id); }}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              {showBookButton && (
                <button
                  onClick={(e) => { e.stopPropagation(); onBookClick?.(hospital.id); }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails?.(hospital.id); }}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;