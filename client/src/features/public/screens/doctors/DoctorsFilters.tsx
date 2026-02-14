import { useState } from "react";
import {
  FilterGroup,
  LocationFilter,
  SpecialityFilter,
  AvailabilityFilter,
  RatingFilter,
} from "../../components/filters";
import { Search, X, ChevronDown, MapPin } from "lucide-react"; // ✅ MapPin import kiya

// ✅ SPECIALITIES - string array
const SPECIALITIES = [
  "Cardiology", "Dermatology", "Orthopedics", "Neurology", "Pediatrics",
  "Gynecology", "ENT", "Ophthalmology", "Dentistry", "Psychiatry"
];

// ✅ POPULAR CITIES - ab use hoga
const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", 
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
];

export function DoctorsFilters() {
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [availability, setAvailability] = useState<"today" | "any">("any");
  const [rating, setRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSpecialityChange = (value: string) => {
    setSpeciality(value);
    if (value && !activeFilters.includes(value)) {
      setActiveFilters([...activeFilters, value]);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value && !activeFilters.includes(value)) {
      setActiveFilters([...activeFilters, value]);
    }
  };

  const handleCitySelect = (city: string) => {
    setLocation(city);
    handleLocationChange(city);
    setShowSuggestions(false);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    if (filter === speciality) setSpeciality("");
    if (filter === location) setLocation("");
  };

  const clearAllFilters = () => {
    setLocation("");
    setSpeciality("");
    setAvailability("any");
    setRating(0);
    setActiveFilters([]);
  };

  // Filter suggestions based on input
  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="doctors-filters">
      {/* Active Filters Tags */}
      {activeFilters.length > 0 && (
        <div className="doctors-filters__active">
          <span className="doctors-filters__active-label">Active filters:</span>
          <div className="doctors-filters__active-list">
            {activeFilters.map((filter) => (
              <span key={filter} className="doctors-filters__active-tag">
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  aria-label={`Remove ${filter} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button 
              className="doctors-filters__clear-all"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="doctors-filters__search">
        <Search size={16} className="doctors-filters__search-icon" />
        <input
          type="text"
          placeholder="Search doctors, specialities, or conditions..."
          className="doctors-filters__search-input"
        />
      </div>

      {/* Filter Groups */}
      <div className="doctors-filters__groups">
        {/* Location Filter - WITHOUT onFocus/onBlur props */}
        <FilterGroup
          label="Location"
          description="City or area"
        >
          <div className="location-filter__wrapper">
            {/* ✅ FIXED: Sirf value aur onChange bhejo, onFocus/onBlur nahi */}
            <LocationFilter 
              value={location} 
              onChange={handleLocationChange}
            />
            
            {/* ✅ City Suggestions - ab alag se handle kiya */}
            {location.length > 0 && filteredCities.length > 0 && (
              <div className="location-filter__suggestions">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    className="location-filter__suggestion"
                    onClick={() => handleCitySelect(city)}
                  >
                    <MapPin size={14} />
                    {city}
                  </button>
                ))}
              </div>
            )}
            
            {/* Popular Cities Quick Pills */}
            {!location && (
              <div className="location-filter__popular">
                <span className="location-filter__popular-label">Popular:</span>
                <div className="location-filter__popular-list">
                  {POPULAR_CITIES.slice(0, 5).map((city) => (
                    <button
                      key={city}
                      className="location-filter__popular-pill"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FilterGroup>

        {/* Speciality Filter */}
        <FilterGroup
          label="Speciality"
          description="Type of doctor"
        >
          <SpecialityFilter
            value={speciality}
            options={SPECIALITIES}
            onChange={handleSpecialityChange}
          />
        </FilterGroup>

        {/* Availability Filter */}
        <FilterGroup
          label="Availability"
          description="Appointment timing"
        >
          <AvailabilityFilter
            value={availability}
            onChange={setAvailability}
          />
        </FilterGroup>

        {/* Rating Filter */}
        <FilterGroup
          label="Patient rating"
          description="Minimum rating"
        >
          <RatingFilter 
            value={rating} 
            onChange={setRating} 
          />
        </FilterGroup>

        {/* Advanced Filters Toggle */}
        <button 
          className="doctors-filters__expand"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Advanced filters</span>
          <ChevronDown 
            size={16} 
            className={`doctors-filters__expand-icon ${isExpanded ? 'rotated' : ''}`} 
          />
        </button>

        {/* Advanced Filters - Expanded */}
        {isExpanded && (
          <div className="doctors-filters__advanced">
            <FilterGroup
              label="Gender"
              description="Doctor's gender"
            >
              <div className="doctors-filters__radio-group">
                <label className="doctors-filters__radio">
                  <input type="radio" name="gender" value="any" defaultChecked />
                  <span>Any</span>
                </label>
                <label className="doctors-filters__radio">
                  <input type="radio" name="gender" value="male" />
                  <span>Male</span>
                </label>
                <label className="doctors-filters__radio">
                  <input type="radio" name="gender" value="female" />
                  <span>Female</span>
                </label>
              </div>
            </FilterGroup>

            <FilterGroup
              label="Languages"
              description="Spoken languages"
            >
              <div className="doctors-filters__checkbox-group">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'].map(lang => (
                  <label key={lang} className="doctors-filters__checkbox">
                    <input type="checkbox" />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </FilterGroup>
          </div>
        )}
      </div>

      {/* Mobile Apply Button */}
      <button className="doctors-filters__apply">
        Apply Filters
        {activeFilters.length > 0 && (
          <span className="doctors-filters__apply-count">({activeFilters.length})</span>
        )}
      </button>
    </div>
  );
}