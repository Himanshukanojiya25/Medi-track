// src/features/public/screens/doctor-profile/DoctorProfileAvailability.tsx

const MOCK_SLOTS = [
  { day: "Today", slots: ["10:00 AM", "11:30 AM", "04:00 PM"] },
  { day: "Tomorrow", slots: ["09:00 AM", "01:00 PM"] },
];

export function DoctorProfileAvailability() {
  return (
    <section className="doctor-profile-availability">
      <div className="doctor-profile-availability__container">
        <h3>Availability</h3>

        {MOCK_SLOTS.map((item) => (
          <div
            key={item.day}
            className="doctor-profile-availability__day"
          >
            <h4>{item.day}</h4>

            <div className="doctor-profile-availability__slots">
              {item.slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="availability-slot"
                  disabled
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="doctor-profile-availability__note">
          Login to book appointments online.
        </p>
      </div>
    </section>
  );
}
