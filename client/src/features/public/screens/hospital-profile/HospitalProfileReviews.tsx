// src/features/public/screens/hospital-profile/HospitalProfileReviews.tsx

const REVIEWS = [
  {
    user: "Rahul Mehta",
    rating: 5,
    comment:
      "Excellent hospital with very professional doctors and clean facilities.",
  },
  {
    user: "Sneha Patil",
    rating: 4,
    comment:
      "Emergency services were quick and staff was very supportive.",
  },
];

export function HospitalProfileReviews() {
  return (
    <section
      className="hospital-profile-reviews"
      aria-labelledby="hospital-reviews-heading"
    >
      <h2 id="hospital-reviews-heading">Patient Reviews</h2>

      <ul className="hospital-review-list">
        {REVIEWS.map((review, index) => (
          <li key={index} className="hospital-review-card">
            <div className="hospital-review-card__header">
              <strong>{review.user}</strong>
              <span>⭐ {review.rating}/5</span>
            </div>

            <p className="hospital-review-card__comment">
              {review.comment}
            </p>
          </li>
        ))}
      </ul>

      <p className="hospital-review-note">
        Reviews are collected from verified patients.
      </p>
    </section>
  );
}
