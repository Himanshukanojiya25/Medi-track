// src/features/public/hooks/usePublicDoctors.ts (mock version)
import { useState, useEffect } from "react";

interface Doctor {
  id: string;
  name: string;
  speciality: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hospital?: {
    name: string;
    location?: string;
  };
  availability?: "today" | "tomorrow" | "this-week";
  avatar?: string;
  consultationFee?: number;
  nextSlot?: string;
}

// ✅ Mock data for testing
const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    speciality: "Cardiology",
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 124,
    hospital: {
      name: "City Heart Institute",
      location: "Mumbai"
    },
    availability: "today",
    consultationFee: 1200,
    nextSlot: "2:30 PM"
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    speciality: "Neurology",
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 98,
    hospital: {
      name: "Neuroscience Center",
      location: "Delhi"
    },
    availability: "tomorrow",
    consultationFee: 1500,
    nextSlot: "11:00 AM"
  },
  // ... add more mock doctors
];

export function usePublicDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctors(MOCK_DOCTORS);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { doctors, isLoading, error: null };
}