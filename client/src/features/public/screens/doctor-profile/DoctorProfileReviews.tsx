// src/features/public/screens/doctor-profile/DoctorProfileReviews.tsx
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Amit Sharma",
    rating: 5,
    date: "2 days ago",
    comment: "Very knowledgeable doctor. Explained everything clearly and patiently. Highly recommended!",
    avatar: "AS",
    verified: true
  },
  {
    id: 2,
    name: "Neha Verma",
    rating: 4,
    date: "1 week ago",
    comment: "Professional and friendly. Clinic was well managed. Slight wait time but worth it.",
    avatar: "NV",
    verified: true
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best cardiologist in Mumbai. Treated my father with great care. Thank you doctor!",
    avatar: "RK",
    verified: true
  },
];

export function DoctorProfileReviews() {
  return (
    <section className="profile-reviews animate-slideUp">
      <div className="reviews-card">
        <div className="reviews-header">
          <h2 className="section-title">
            <span className="title-icon">⭐</span>
            Patient Reviews
          </h2>
          
          <div className="rating-summary">
            <span className="average-rating">4.8</span>
            <div className="rating-stars">
              {[1,2,3,4,5].map(star => (
                <span key={star} className="star filled">★</span>
              ))}
            </div>
            <span className="total-reviews">(324 reviews)</span>
          </div>
        </div>

        <div className="reviews-list">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-avatar">
                {review.avatar}
              </div>
              
              <div className="review-content">
                <div className="review-top">
                  <span className="reviewer-name">{review.name}</span>
                  {review.verified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                  <span className="review-date">{review.date}</span>
                </div>
                
                <div className="review-rating">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="view-all-btn">
          View All 324 Reviews
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </section>
  );
}