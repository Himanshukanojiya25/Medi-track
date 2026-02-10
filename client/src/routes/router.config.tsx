// src/routes/router.config.ts

import { createBrowserRouter } from "react-router-dom";

/* =========================
   LAYOUTS
========================= */
import { PublicLayout } from "../layouts/public/PublicLayout";
import { AuthLayout as PublicAuthLayout } from "../layouts/public/AuthLayout";
import { AuthLayout } from "../layouts/auth/AuthLayout";
import { PatientLayout } from "../layouts/patient/PatientLayout";
import { DoctorLayout } from "../layouts/doctor/DoctorLayout";
import { HospitalAdminLayout } from "../layouts/hospital-admin/HospitalAdminLayout";
import { SuperAdminLayout } from "../layouts/super-admin/SuperAdminLayout";
import { BillingLayout } from "../layouts/billing/BillingLayout";
import { AILayout } from "../layouts/ai/AILayout";
import { ErrorLayout } from "../layouts/shared/ErrorLayout";

/* =========================
   PUBLIC SCREENS
========================= */
import { HomeScreen } from "../features/public/screens/home";
import { SearchScreen } from "../features/public/screens/search";
import { HospitalsScreen } from "../features/public/screens/hospitals";
import { HospitalProfileScreen } from "../features/public/screens/hospital-profile";
import { DoctorsScreen } from "../features/public/screens/doctors";
import { DoctorProfileScreen } from "../features/public/screens/doctor-profile";
import { SpecialityScreen } from "../features/public/screens/speciality";
import { FaqScreen } from "../features/public/screens/faq";
import { AboutScreen } from "../features/public/screens/about";
import { ContactScreen } from "../features/public/screens/contact";
import { AiSymptomScreen } from "../features/public/screens/ai-symptom";
import { EmergencyScreen } from "../features/public/screens/emergency";

/* =========================
   PLACEHOLDER
========================= */
const Placeholder = ({ title }: { title: string }) => (
  <div className="page-placeholder">{title}</div>
);

/* =========================
   ROUTER CONFIG (NO JSX FILE)
========================= */
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "search", element: <SearchScreen /> },
      { path: "hospitals", element: <HospitalsScreen /> },
      { path: "hospitals/:hospitalId", element: <HospitalProfileScreen /> },
      { path: "doctors", element: <DoctorsScreen /> },
      { path: "doctors/:doctorId", element: <DoctorProfileScreen /> },
      { path: "specialities", element: <SpecialityScreen /> },
      { path: "faq", element: <FaqScreen /> },
      { path: "about", element: <AboutScreen /> },
      { path: "contact", element: <ContactScreen /> },
      { path: "ai-symptom", element: <AiSymptomScreen /> },
      { path: "emergency", element: <EmergencyScreen /> },
    ],
  },

  {
    path: "/auth",
    element: <PublicAuthLayout />,
    children: [
      { path: "login", element: <Placeholder title="Login" /> },
      { path: "register", element: <Placeholder title="Register" /> },
    ],
  },

  {
    path: "*",
    element: <ErrorLayout />,
  },
]);
