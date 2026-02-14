import { Search, MapPin, Stethoscope, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function HomeHero() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <section className="home-hero">
      {/* Animated Background Elements */}
      <div className="home-hero__gradient" />
      <div className="home-hero__pattern" />
      <div className="home-hero__particles" />
      
      <div className="home-hero__container">
        {/* Badge */}
        <div className="home-hero__badge">
          <span className="home-hero__badge-dot" />
          Trusted by 10,000+ patients across India
        </div>
        
        {/* Main Heading */}
        <h1 className="home-hero__title">
          Your Health, 
          <br />
          <span className="home-hero__title-highlight">
            Simplified.
          </span>
        </h1>
        
        <p className="home-hero__subtitle">
          Find the right doctor, book appointments, and get AI-powered health guidance — 
          all in one secure platform.
        </p>
        
        {/* Search Bar — Premium Glass Morphism */}
        <div className="home-hero__search-container">
          <div className="home-hero__search-wrapper">
            <Search className="home-hero__search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for doctors, hospitals, specialities..."
              className="home-hero__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search doctors, hospitals, or specialities"
            />
          </div>
          
          <div className="home-hero__location-wrapper">
            <MapPin className="home-hero__location-icon" size={18} />
            
            {/* ✅ FIXED: SIRF aria-label - title HATAYA */}
            <select 
              className="home-hero__location-select"
              aria-label="Select your city"
            >
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="kolkata">Kolkata</option>
              <option value="ahmedabad">Ahmedabad</option>
            </select>
          </div>
          
          <button 
            className="home-hero__search-button"
            aria-label="Perform search"
          >
            Search
            <ArrowRight size={18} />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="home-hero__quick-actions">
          <a 
            href="/doctors" 
            className="home-hero__quick-action"
            aria-label="Find doctors near you"
          >
            <div className="home-hero__quick-action-icon">
              <Stethoscope size={20} aria-hidden="true" />
            </div>
            <span>Find Doctors</span>
          </a>
          
          <a 
            href="/hospitals" 
            className="home-hero__quick-action"
            aria-label="Find hospitals near you"
          >
            <div className="home-hero__quick-action-icon">
              <Building2 size={20} aria-hidden="true" />
            </div>
            <span>Find Hospitals</span>
          </a>
          
          <a 
            href="/ai-symptom" 
            className="home-hero__quick-action home-hero__quick-action--ai"
            aria-label="Check your symptoms with AI"
          >
            <div className="home-hero__quick-action-icon">
              <span className="home-hero__quick-action-ai-badge" aria-hidden="true">AI</span>
            </div>
            <span>Check Symptoms</span>
          </a>
        </div>
      </div>
    </section>
  );
}