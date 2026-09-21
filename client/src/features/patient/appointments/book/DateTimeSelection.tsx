// client/src/features/patient/appointments/book/DateTimeSelection.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle, User, MapPin, Star, Award, CheckCircle2 } from 'lucide-react';
import type { Doctor } from './BookAppointmentScreen';

interface DateTimeSelectionProps {
  doctor: Doctor;
  onSelect: (date: Date, time: string) => void;
}

// Generate mock available time slots
const generateTimeSlots = (date: Date): string[] => {
  const slots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];
  
  // Randomly remove some slots to show realistic availability
  const randomIndex = Math.floor(Math.random() * slots.length);
  return slots.filter((_, i) => i !== randomIndex && i !== (randomIndex + 1) % slots.length);
};

const getDaysInMonth = (date: Date): (Date | null)[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  // Add days of month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
};

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({ doctor, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setIsLoading(true);
    setSelectedDate(date);
    setSelectedTime(null);
    
    // Simulate API call
    setTimeout(() => {
      const slots = generateTimeSlots(date);
      setAvailableSlots(slots);
      setIsLoading(false);
    }, 400);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <style>{`
        .date-btn {
          transition: all 0.2s ease;
        }
        .date-btn:hover:not(:disabled):not(.selected) {
          border-color: #bfdbfe !important;
          background: #eff6ff !important;
        }
        .time-slot {
          transition: all 0.2s ease;
        }
        .time-slot:hover:not(.selected):not(:disabled) {
          border-color: #bfdbfe !important;
          background: #eff6ff !important;
          transform: translateY(-1px);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slot-animate { animation: slideUp 0.3s ease; }
      `}</style>

      {/* Doctor Info Card */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
            {doctor.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {doctor.rating} ({doctor.totalReviews} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Award size={12} />
                {doctor.experience} years
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {doctor.hospitalName}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Fee</p>
            <p className="text-xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold text-gray-800">{formatMonthYear(currentMonth)}</span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 px-3 pt-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 p-3">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="p-2" />;
            }

            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                disabled={isDisabled}
                className={`date-btn p-2 rounded-lg text-center transition-all ${
                  isSelected ? 'selected bg-blue-600 text-white shadow-md' : ''
                } ${
                  isToday && !isSelected ? 'border border-blue-400 bg-blue-50' : ''
                } ${
                  isDisabled ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="slot-animate">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Available Slots for {formatDate(selectedDate)}</h3>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Clock size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">No available slots</p>
              <p className="text-sm text-gray-400">Please select another date</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {availableSlots.map((time, idx) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`time-slot py-2.5 px-3 rounded-lg text-center font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div className="mt-8 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Selected Appointment</p>
              <p className="font-semibold text-gray-800">
                {formatDate(selectedDate)} at {selectedTime}
              </p>
            </div>
            <CheckCircle2 size={24} className="text-green-500" />
          </div>
          <button
            onClick={() => onSelect(selectedDate, selectedTime)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Continue to Review
          </button>
        </div>
      )}
    </>
  );
};

export { DateTimeSelection };
export default DateTimeSelection;