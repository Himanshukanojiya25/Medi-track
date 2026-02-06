import { Routes, Route } from 'react-router-dom';

import {
  HomePage,
  AboutPage,
  ContactPage,
  FaqPage,
  DoctorsListPage,
  HospitalsListPage,
  DoctorProfilePage,
  HospitalProfilePage,
  AISymptomPage,
} from '../pages';

/**
 * PublicRoutes
 * -------------
 * Handles all public / website routes.
 * - No authentication
 * - No role guards
 * - SEO-friendly pages
 */

export const PublicRoutes = () => {
  return (
    <Routes>
      {/* LANDING & INFO */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />

      {/* DISCOVERY */}
      <Route path="/doctors" element={<DoctorsListPage />} />
      <Route path="/hospitals" element={<HospitalsListPage />} />

      {/* PROFILES */}
      <Route path="/doctor-profile" element={<DoctorProfilePage />} />
      <Route path="/hospital-profile" element={<HospitalProfilePage />} />

      {/* AI */}
      <Route path="/ai-symptom" element={<AISymptomPage />} />
    </Routes>
  );
};

export default PublicRoutes;
