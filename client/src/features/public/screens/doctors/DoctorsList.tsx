import { DoctorCard, CardSkeleton } from "../../components/cards";
import { usePublicDoctors } from "../../hooks/usePublicDoctors";
import { SortAsc, Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// ✅ Doctor type definition (agar nahi hai to yahan define karo)
interface Doctor {
  id: string;
  name: string;
  speciality: string;
  experienceYears: number;
  rating: number;
  reviewCount?: number; // ✅ totalRatings ki jagah reviewCount
  hospital?: {
    name: string;
    location?: string;
  };
  availability?: "today" | "tomorrow" | "this-week";
  avatar?: string; // ✅ image ki jagah avatar
  consultationFee?: number; // ✅ fees ki jagah consultationFee
  nextSlot?: string; // ✅ nextAvailable ki jagah nextSlot
}

export function DoctorsList() {
  const { doctors, isLoading } = usePublicDoctors();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "availability">("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // ✅ Safe access with optional chaining
  const doctorsList = (doctors as Doctor[]) || [];
  const totalPages = Math.ceil(doctorsList.length / itemsPerPage);
  const paginatedDoctors = doctorsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* Loading State */
  if (isLoading) {
    return (
      <div className="doctors-list">
        <div className="doctors-list__header">
          <div className="doctors-list__skeleton-title" />
          <div className="doctors-list__skeleton-sort" />
        </div>
        <div className={`doctors-list__grid doctors-list__grid--${viewMode}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* Empty State */
  if (!doctorsList.length) {
    return (
      <div className="doctors-list doctors-list--empty">
        <div className="doctors-list__empty">
          <div className="doctors-list__empty-icon">👨‍⚕️</div>
          <h3 className="doctors-list__empty-title">No doctors found</h3>
          <p className="doctors-list__empty-description">
            Try adjusting your filters or searching in a nearby location.
          </p>
          <button className="doctors-list__empty-action">
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  /* Results */
  return (
    <div className="doctors-list">
      {/* List Header */}
      <div className="doctors-list__header">
        <div className="doctors-list__info">
          <h2 className="doctors-list__title">
            {doctorsList.length} doctors available
          </h2>
          <p className="doctors-list__subtitle">
            Verified specialists ready to help you
          </p>
        </div>

        <div className="doctors-list__controls">
          {/* Sort Dropdown */}
          <div className="doctors-list__sort">
            <SortAsc size={16} aria-hidden="true" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort doctors by"
            >
              <option value="rating">Top Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="availability">Available Today</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="doctors-list__view-toggle">
            <button
              className={`doctors-list__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              className={`doctors-list__view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className={`doctors-list__grid doctors-list__grid--${viewMode}`}>
        {paginatedDoctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            id={doc.id}
            name={doc.name}
            speciality={doc.speciality}
            experience={doc.experienceYears}
            rating={doc.rating}
            reviewCount={doc.reviewCount || 0} // ✅ totalRatings → reviewCount
            hospital={doc.hospital?.name}
            location={doc.hospital?.location}
            availability={doc.availability}
            avatar={doc.avatar} // ✅ image → avatar
            consultationFee={doc.consultationFee} // ✅ fees → consultationFee
            nextSlot={doc.nextSlot} // ✅ nextAvailable → nextSlot
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="doctors-list__pagination">
          <button
            className="doctors-list__pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="doctors-list__pagination-pages">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`doctors-list__pagination-page ${
                  currentPage === i + 1 ? 'active' : ''
                }`}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            className="doctors-list__pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}