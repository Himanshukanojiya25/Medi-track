import { Search, MapPin, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PublicHeroSearchProps {
  variant?: "default" | "doctors" | "hospitals" | "ai" | "emergency";
  placeholder?: string;
}

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"
];

export function PublicHeroSearch({ 
  variant = "default",
  placeholder = "Search for doctors, hospitals, specialities..."
}: PublicHeroSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Click outside handler - suggestion band hoga jab bahar click kare
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(location.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setLocation(city);
    setIsOpen(false);
  };

  return (
    <div className={`public-hero-search public-hero-search--${variant}`}>
      <div className="public-hero-search__container">
        
        {/* Search Input */}
        <div className="public-hero-search__input-wrapper">
          <Search className="public-hero-search__icon" size={20} />
          <input
            type="text"
            className="public-hero-search__input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ✅ Location Selector - Fixed dropdown position */}
        <div className="public-hero-search__location-wrapper" ref={locationRef}>
          <MapPin className="public-hero-search__location-icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="public-hero-search__location-input"
            placeholder="Select city"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            readOnly={false}
          />
          
          {/* ✅ SUGGESTIONS - Ab overlapping nahi hogi, proper positioned */}
          {isOpen && filteredCities.length > 0 && (
            <div className="public-hero-search__suggestions">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  className="public-hero-search__suggestion"
                  onClick={() => handleCitySelect(city)}
                  type="button"
                >
                  <MapPin size={14} />
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="public-hero-search__button">
          <span>Search</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ✅ Popular Cities Pills - Ab neeche properly align */}
      {!location && (
        <div className="public-hero-search__popular">
          <span className="public-hero-search__popular-label">POPULAR:</span>
          <div className="public-hero-search__popular-list">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                className="public-hero-search__popular-pill"
                onClick={() => handleCitySelect(city)}
                type="button"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}