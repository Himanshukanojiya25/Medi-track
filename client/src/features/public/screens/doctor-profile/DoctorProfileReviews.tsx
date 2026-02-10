// src/features/public/screens/doctor-profile/DoctorProfileReviews.tsx

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Amit Sharma",
    rating: 5,
    comment:
      "Very knowledgeable doctor. Explained everything clearly and patiently.",
  },
  {
    id: 2,
    name: "Neha Verma",
    rating: 4,
    comment:
      "Professional and friendly. Clinic was well managed.",
  },
];

export function DoctorProfileReviews() {
  return (
    <section className="doctor-profile-reviews">
      <div className="doctor-profile-reviews__container">
        <h3>Patient Reviews</h3>

        <ul className="doctor-profile-reviews__list">
          {MOCK_REVIEWS.map((review) => (
            <li
              key={review.id}
              className="doctor-profile-review"
            >
              <div className="doctor-profile-review__header">
                <strong>{review.name}</strong>
                <span>⭐ {review.rating}/5</span>
              </div>

              <p className="doctor-profile-review__comment">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>

        <p className="doctor-profile-reviews__note">
          Showing verified patient reviews.
        </p>
      </div>
    </section>
  );
}
