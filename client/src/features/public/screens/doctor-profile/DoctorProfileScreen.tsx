// src/features/public/screens/doctor-profile/DoctorProfileScreen.tsx
import { SeoShell } from "../../../../layouts/public/components/SeoShell/SeoShell";
import { DoctorProfileHeader } from "./DoctorProfileHeader";
import { DoctorProfileActions } from "./DoctorProfileActions";
import { DoctorProfileDetails } from "./DoctorProfileDetails";
import { DoctorProfileAvailability } from "./DoctorProfileAvailability";
import { DoctorProfileSpecialities } from "./DoctorProfileSpecialities";
import { DoctorProfileReviews } from "./DoctorProfileReviews";
import '../../../../styles/pages/website/doctor-profile.css'; // ✅ Correct path

export function DoctorProfileScreen() {
  return (
    <>
      <SeoShell
        title="Dr. John Doe – Cardiologist in Mumbai | 12+ Years Experience"
        description="Consult Dr. John Doe, a top-rated cardiologist in Mumbai with 12+ years of experience. View profile, ratings, patient reviews, and book appointments online."
        keywords="cardiologist mumbai, heart specialist, dr john doe, cardiology, book appointment"
        image="/images/doctors/john-doe.jpg"
      />

      <main className="doctor-profile-page">
        {/* Background Elements */}
        <div className="profile-bg">
          <div className="bg-orb orbs-1"></div>
          <div className="bg-orb orbs-2"></div>
          <div className="bg-grid"></div>
        </div>

        <div className="profile-container">
          <DoctorProfileHeader />
          <DoctorProfileActions />
          
          <div className="profile-grid">
            <div className="profile-grid-main">
              <DoctorProfileDetails />
              <DoctorProfileSpecialities />
              <DoctorProfileReviews />
            </div>
            
            <div className="profile-grid-sidebar">
              <DoctorProfileAvailability />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}