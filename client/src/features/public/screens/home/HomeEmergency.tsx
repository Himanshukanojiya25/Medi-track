import { AlertTriangle, Phone, ArrowRight, Heart } from "lucide-react";

interface HomeEmergencyProps {
  phoneNumber?: string;
  ambulanceNumber?: string;
}

export function HomeEmergency({ 
  phoneNumber = "108", 
  ambulanceNumber = "102" 
}: HomeEmergencyProps) {
  return (
    <section className="home-emergency">
      <div className="home-emergency__container">
        {/* Background Pattern */}
        <div className="home-emergency__pattern" />
        
        <div className="home-emergency__content">
          <div className="home-emergency__badge">
            <AlertTriangle size={14} />
            Emergency Care
          </div>
          
          <div className="home-emergency__grid">
            {/* Left Content */}
            <div className="home-emergency__info">
              <h2 className="home-emergency__title">
                Medical emergency?<br />
                <span>We're here 24/7</span>
              </h2>
              
              <p className="home-emergency__description">
                If you or someone around you needs immediate help, 
                contact emergency services right now. Every second counts.
              </p>
              
              <div className="home-emergency__stats">
                <div className="home-emergency__stat">
                  <Heart size={16} />
                  <span>Average response: 12 mins</span>
                </div>
                <div className="home-emergency__stat">
                  <Phone size={16} />
                  <span>24/7 emergency support</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Contact Cards */}
            <div className="home-emergency__actions">
              {/* Medical Emergency */}
              <div className="home-emergency__card home-emergency__card--emergency">
                <div className="home-emergency__card-header">
                  <div className="home-emergency__card-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="home-emergency__card-info">
                    <h3>Medical Emergency</h3>
                    <p>Ambulance & emergency services</p>
                  </div>
                </div>
                
                <a
                  href={`tel:${phoneNumber}`}
                  className="home-emergency__call-button"
                >
                  <Phone size={18} />
                  Call {phoneNumber}
                  <ArrowRight size={18} />
                </a>
              </div>
              
              {/* Ambulance Service */}
              <div className="home-emergency__card home-emergency__card--ambulance">
                <div className="home-emergency__card-header">
                  <div className="home-emergency__card-icon">
                    <Heart size={24} />
                  </div>
                  <div className="home-emergency__card-info">
                    <h3>Ambulance</h3>
                    <p>24/7 ambulance service</p>
                  </div>
                </div>
                
                <a
                  href={`tel:${ambulanceNumber}`}
                  className="home-emergency__call-button"
                >
                  <Phone size={18} />
                  Call {ambulanceNumber}
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <p className="home-emergency__disclaimer">
          ⚕️ For life-threatening emergencies, please call emergency services immediately. 
          This platform provides guidance but is not a substitute for professional medical help.
        </p>
      </div>
    </section>
  );
}