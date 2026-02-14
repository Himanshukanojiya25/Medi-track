// src/layouts/public/AuthLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SeoShell } from "./components/SeoShell";
import { Shield, Sparkles, Heart, Building2, Stethoscope, ArrowRight, CheckCircle, Star, Quote } from "lucide-react";
import { useEffect, useState, memo } from "react";

// ✅ Brand features data - constant, memoized
const BRAND_FEATURES = [
  {
    id: 1,
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your data is encrypted and secure",
    color: "#3b82f6"
  },
  {
    id: 2,
    icon: Building2,
    title: "120+ Hospitals",
    description: "Trusted by top healthcare facilities",
    color: "#8b5cf6"
  },
  {
    id: 3,
    icon: Stethoscope,
    title: "500+ Doctors",
    description: "Verified specialists available 24/7",
    color: "#10b981"
  },
  {
    id: 4,
    icon: Heart,
    title: "10k+ Patients",
    description: "Lives impacted every month",
    color: "#f59e0b"
  }
];

// ✅ Testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    quote: "MediTrack made it so easy to find the right specialist. The AI symptom checker saved me hours of research.",
    author: "Dr. Sarah Johnson",
    role: "Cardiologist",
    rating: 5
  },
  {
    id: 2,
    quote: "Our hospital network has seen 40% faster patient onboarding since adopting MediTrack.",
    author: "Michael Chen",
    role: "Hospital Administrator",
    rating: 5
  }
];

// ✅ Brand Side Component - Memoized for performance
const BrandSide = memo(function BrandSide() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="auth-brand">
      {/* Animated gradient background */}
      <div className="auth-brand__gradient" />
      <div className="auth-brand__pattern" />
      <div className="auth-brand__particles" />
      
      <div className="auth-brand__content">
        {/* Logo with premium badge */}
        <a href="/" className="auth-brand__logo" aria-label="MediTrack Home">
          <span className="auth-brand__logo-text">MediTrack</span>
          <span className="auth-brand__badge">
            <Sparkles size={14} aria-hidden="true" />
            <span>AI-Powered</span>
          </span>
        </a>

        {/* Dynamic greeting based on time */}
        <div className="auth-brand__greeting">
          <span className="auth-brand__greeting-badge">
            {new Date().getHours() < 12 ? '🌅 Good Morning' : 
             new Date().getHours() < 18 ? '☀️ Good Afternoon' : '🌙 Good Evening'}
          </span>
        </div>
        
        {/* Main headline */}
        <h1 className="auth-brand__title">
          Welcome back to{' '}
          <span className="auth-brand__highlight">
            MediTrack
          </span>
        </h1>
        
        {/* Value proposition */}
        <p className="auth-brand__description">
          Secure healthcare platform trusted by 10,000+ patients and 500+ verified doctors.
          <span className="auth-brand__description-badge">Enterprise Ready</span>
        </p>

        {/* Features grid */}
        <div className="auth-brand__features">
          {BRAND_FEATURES.map((feature) => (
            <div 
              key={feature.id} 
              className="auth-brand__feature"
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="auth-brand__feature-icon-wrapper">
                <feature.icon className="auth-brand__feature-icon" size={20} aria-hidden="true" />
                <div className="auth-brand__feature-icon-glow" />
              </div>
              <div className="auth-brand__feature-text">
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Animated testimonial carousel */}
        <div className="auth-brand__testimonial">
          <Quote className="auth-brand__testimonial-quote" size={24} aria-hidden="true" />
          
          <div className="auth-brand__testimonial-content">
            <p key={TESTIMONIALS[currentTestimonial].id} className="auth-brand__testimonial-text">
              "{TESTIMONIALS[currentTestimonial].quote}"
            </p>
            
            <div className="auth-brand__testimonial-footer">
              <div className="auth-brand__testimonial-author">
                <div className="auth-brand__testimonial-author-info">
                  <strong>{TESTIMONIALS[currentTestimonial].author}</strong>
                  <span>{TESTIMONIALS[currentTestimonial].role}</span>
                </div>
              </div>
              
              <div className="auth-brand__testimonial-rating">
                {Array.from({ length: TESTIMONIALS[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial navigation dots */}
          <div className="auth-brand__testimonial-nav">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                className={`auth-brand__testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="auth-brand__trust">
          <div className="auth-brand__trust-item">
            <CheckCircle size={16} aria-hidden="true" />
            <span>HIPAA Ready</span>
          </div>
          <div className="auth-brand__trust-item">
            <CheckCircle size={16} aria-hidden="true" />
            <span>GDPR Compliant</span>
          </div>
          <div className="auth-brand__trust-item">
            <CheckCircle size={16} aria-hidden="true" />
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ✅ Auth Form Side Component - Memoized
const AuthSide = memo(function AuthSide() {
  const location = useLocation();
  
  // Dynamic title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('login')) return 'Sign in to your account';
    if (location.pathname.includes('signup')) return 'Create your account';
    if (location.pathname.includes('forgot-password')) return 'Reset your password';
    return 'Welcome back';
  };

  const getPageDescription = () => {
    if (location.pathname.includes('login')) return 'Secure access to your healthcare dashboard';
    if (location.pathname.includes('signup')) return 'Join 10,000+ healthcare professionals';
    if (location.pathname.includes('forgot-password')) return 'We\'ll send you a reset link';
    return 'Continue your healthcare journey';
  };

  return (
    <main
      role="main"
      className="auth-layout"
      aria-label="Authentication content"
    >
      <div className="auth-layout__container">
        {/* Back to home link */}
        <a href="/" className="auth-layout__back-link" aria-label="Back to home">
          <ArrowRight size={16} aria-hidden="true" />
          <span>Back to home</span>
        </a>

        {/* Header with dynamic content */}
        <div className="auth-layout__header">
          <div className="auth-layout__header-content">
            <h1 className="auth-layout__title">
              {getPageTitle()}
            </h1>
            <p className="auth-layout__description">
              {getPageDescription()}
            </p>
          </div>
        </div>

        {/* Dynamic form content from child routes */}
        <div className="auth-layout__content">
          <Outlet />
        </div>

        {/* Footer with support and links */}
        <div className="auth-layout__footer">
          <div className="auth-layout__footer-content">
            <p className="auth-layout__help">
              <span>Need assistance?</span>
              <a href="/contact" className="auth-layout__help-link">
                Contact 24/7 Support
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </p>
            
            <div className="auth-layout__links">
              <a href="/privacy" className="auth-layout__link">Privacy Policy</a>
              <span className="auth-layout__divider" aria-hidden="true">•</span>
              <a href="/terms" className="auth-layout__link">Terms of Service</a>
            </div>

            <div className="auth-layout__security">
              <Shield size={14} aria-hidden="true" />
              <span>Enterprise-grade security • AES-256 encryption</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

// ✅ Main AuthLayout Component
export function AuthLayout() {
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      // Redirect to appropriate dashboard based on role
      try {
        const userData = JSON.parse(user);
        switch(userData.role) {
          case 'patient':
            navigate("/patient/dashboard", { replace: true });
            break;
          case 'doctor':
            navigate("/doctor/dashboard", { replace: true });
            break;
          case 'hospital_admin':
            navigate("/hospital-admin/dashboard", { replace: true });
            break;
          case 'super_admin':
            navigate("/super-admin/dashboard", { replace: true });
            break;
          default:
            navigate("/dashboard", { replace: true });
        }
      } catch {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <SeoShell
      noIndex
      title="Secure Healthcare Login & Sign Up | MediTrack"
      description="Access your MediTrack account securely. Enterprise-grade authentication for patients, doctors, and healthcare providers. HIPAA compliant."
      keywords="healthcare login, patient portal, doctor sign in, hospital admin, secure authentication"
    >
      <div className="auth-wrapper">
        <BrandSide />
        <AuthSide />
      </div>
    </SeoShell>
  );
}