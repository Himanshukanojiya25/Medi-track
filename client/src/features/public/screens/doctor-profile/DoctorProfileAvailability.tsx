// src/features/public/screens/doctor-profile/DoctorProfileAvailability.tsx
import { useState } from 'react';

const MOCK_SLOTS = [
  { 
    day: "Today", 
    date: "Mar 5",
    slots: ["10:00 AM", "11:30 AM", "04:00 PM", "05:30 PM"],
    available: 4
  },
  { 
    day: "Tomorrow", 
    date: "Mar 6",
    slots: ["09:00 AM", "01:00 PM", "03:30 PM"],
    available: 3
  },
  { 
    day: "Fri", 
    date: "Mar 7",
    slots: ["11:00 AM", "02:30 PM", "06:00 PM"],
    available: 3
  },
];

export function DoctorProfileAvailability() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <section className="profile-availability animate-slideUp">
      <div className="availability-card">
        <div className="card-header">
          <h2 className="section-title">
            <span className="title-icon">📅</span>
            Available Slots
          </h2>
          <span className="timezone">IST (UTC+5:30)</span>
        </div>

        <div className="slots-container">
          {MOCK_SLOTS.map((item) => (
            <div key={item.day} className="day-slots">
              <div className="day-header">
                <div>
                  <span className="day-name">{item.day}</span>
                  <span className="day-date">{item.date}</span>
                </div>
                <span className="slots-count">{item.available} slots</span>
              </div>

              <div className="slots-grid">
                {item.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="availability-footer">
          <p className="login-note">
            <span className="note-icon">🔒</span>
            Login to book appointments online
          </p>
          
          <button className="book-btn" disabled={!selectedSlot}>
            Book Selected Slot
          </button>
        </div>
      </div>
    </section>
  );
}