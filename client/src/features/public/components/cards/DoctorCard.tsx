// src/features/public/components/cards/DoctorCard.tsx
import { Star, Clock, MapPin, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

interface DoctorCardProps {
  id: string;
  name: string;
  speciality: string;
  experience: number;
  rating: number;
  reviewCount?: number;
  hospital?: string;
  location?: string;
  availability?: "today" | "tomorrow" | "this-week";
  avatar?: string;
  consultationFee?: number;
  nextSlot?: string;
}

export function DoctorCard({
  id,
  name,
  speciality,
  experience,
  rating,
  reviewCount = 0,
  hospital,
  location,
  availability,
  avatar,
  consultationFee,
  nextSlot
}: DoctorCardProps) {
  return (
    <Link to={`/doctor/${id}`} className="doctor-card">
      <div className="doctor-card__content">
        {/* Avatar */}
        <div className="doctor-card__avatar">
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <div className="doctor-card__avatar-placeholder">
              {name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="doctor-card__info">
          <h3 className="doctor-card__name">{name}</h3>
          <p className="doctor-card__speciality">{speciality}</p>
          
          <div className="doctor-card__details">
            <span className="doctor-card__experience">
              {experience} years experience
            </span>
            
            {hospital && (
              <span className="doctor-card__hospital">
                <MapPin size={14} />
                {hospital}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="doctor-card__rating">
            <div className="doctor-card__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < rating ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="doctor-card__review-count">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="doctor-card__meta">
          {availability === 'today' && (
            <span className="doctor-card__badge doctor-card__badge--today">
              <Clock size={12} />
              Available Today
            </span>
          )}
          
          {consultationFee && (
            <div className="doctor-card__fee">
              <IndianRupee size={14} />
              <span>{consultationFee}</span>
            </div>
          )}
          
          {nextSlot && (
            <p className="doctor-card__next-slot">
              Next: {nextSlot}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}