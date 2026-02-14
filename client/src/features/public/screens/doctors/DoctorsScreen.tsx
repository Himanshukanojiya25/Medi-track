import { SeoShell } from "../../../../layouts/public/components/SeoShell/SeoShell";
import { DoctorsFilters } from "./DoctorsFilters";
import { DoctorsList } from "./DoctorsList";
import { Stethoscope, Filter, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export function DoctorsScreen() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <>
      <SeoShell
        title="Find Trusted Doctors Near You | MediTrack"
        description="Discover verified doctors by speciality, location, availability and patient ratings. Make confident healthcare decisions with MediTrack."
        keywords="doctors near me, cardiologist, dermatologist, pediatrician, orthopedic, neurologist, verified doctors"
        canonical="/doctors"
      />

      <main className="doctors-page">
        {/* Hero Section */}
        <section className="doctors-hero">
          <div className="doctors-hero__gradient" />
          <div className="doctors-hero__pattern" />
          
          <div className="doctors-hero__container">
            <div className="doctors-hero__badge">
              <Stethoscope size={14} aria-hidden="true" />
              <span>500+ Verified Specialists</span>
            </div>
            
            <h1 className="doctors-hero__title">
              Find the Right Doctor,<br />
              <span className="doctors-hero__title-highlight">For Your Health</span>
            </h1>
            
            <p className="doctors-hero__description">
              Browse India's largest network of verified doctors and specialists. 
              Filter by speciality, location, availability, and patient ratings to make 
              confident healthcare decisions.
            </p>

            {/* Quick Stats */}
            <div className="doctors-hero__stats">
              <div className="doctors-hero__stat">
                <span className="doctors-hero__stat-value">500+</span>
                <span className="doctors-hero__stat-label">Doctors</span>
              </div>
              <div className="doctors-hero__stat">
                <span className="doctors-hero__stat-value">30+</span>
                <span className="doctors-hero__stat-label">Specialities</span>
              </div>
              <div className="doctors-hero__stat">
                <span className="doctors-hero__stat-value">24/7</span>
                <span className="doctors-hero__stat-label">Availability</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="doctors-content">
          <div className="doctors-content__container">
            {/* Mobile Filter Toggle */}
            <div className="doctors-mobile-header">
              <button
                className="doctors-mobile-filter-toggle"
                onClick={() => setIsMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>
              <span className="doctors-results-count">150+ doctors available</span>
            </div>

            {/* Filters + Results Grid */}
            <div className="doctors-grid">
              {/* Sidebar Filters - Desktop */}
              <aside className="doctors-sidebar">
                <div className="doctors-sidebar__header">
                  <div className="doctors-sidebar__title">
                    <Filter size={18} aria-hidden="true" />
                    <h2>Refine Results</h2>
                  </div>
                  <button className="doctors-sidebar__clear">
                    Clear all
                  </button>
                </div>
                <DoctorsFilters />
              </aside>

              {/* Results List */}
              <div className="doctors-results">
                <DoctorsList />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filters Drawer */}
        <div 
          className={`doctors-mobile-drawer ${isMobileFiltersOpen ? 'open' : ''}`}
          aria-hidden={!isMobileFiltersOpen}
        >
          <div className="doctors-mobile-drawer__header">
            <h3>Filters</h3>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
          <div className="doctors-mobile-drawer__content">
            <DoctorsFilters />
          </div>
          <div className="doctors-mobile-drawer__footer">
            <button 
              className="doctors-mobile-drawer__apply"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Mobile Drawer Backdrop */}
        {isMobileFiltersOpen && (
          <div 
            className="doctors-mobile-backdrop"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-hidden="true"
          />
        )}
      </main>
    </>
  );
}