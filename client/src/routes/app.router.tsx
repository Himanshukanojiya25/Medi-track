import { createBrowserRouter } from "react-router-dom";

/* =========================
   LAYOUT IMPORTS
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
   PUBLIC SCREENS (PHASE-1.0)
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
   TEMP PLACEHOLDER
   (NON-PUBLIC AREAS ONLY)
========================= */
type PlaceholderProps = {
  title: string;
};

const Placeholder = ({ title }: PlaceholderProps) => {
  return <div className="page-placeholder">{title}</div>;
};

/* =========================
   APP ROUTER (SINGLE SOURCE)
========================= */
export const appRouter = createBrowserRouter([
  /* ---------- PUBLIC WEBSITE (PHASE-1.0 LIVE) ---------- */
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

  /* ---------- PUBLIC AUTH (MARKETING) ---------- */
  {
    path: "/auth",
    element: <PublicAuthLayout />,
    children: [
      { path: "login", element: <Placeholder title="Login" /> },
      { path: "register", element: <Placeholder title="Register" /> },
      { path: "forgot-password", element: <Placeholder title="Forgot Password" /> },
      { path: "reset-password", element: <Placeholder title="Reset Password" /> },
    ],
  },

  /* ---------- SYSTEM AUTH ---------- */
  {
    path: "/system-auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Placeholder title="System Login" /> },
    ],
  },

  /* ---------- PATIENT ---------- */
  {
    path: "/patient",
    element: <PatientLayout />,
    children: [
      { index: true, element: <Placeholder title="Patient Dashboard" /> },
      { path: "appointments", element: <Placeholder title="My Appointments" /> },
      { path: "history", element: <Placeholder title="Medical History" /> },
      { path: "profile", element: <Placeholder title="Patient Profile" /> },
    ],
  },

  /* ---------- DOCTOR ---------- */
  {
    path: "/doctor",
    element: <DoctorLayout />,
    children: [
      { index: true, element: <Placeholder title="Doctor Dashboard" /> },
      { path: "appointments", element: <Placeholder title="Today Appointments" /> },
      { path: "availability", element: <Placeholder title="Availability" /> },
      { path: "prescriptions", element: <Placeholder title="Prescriptions" /> },
    ],
  },

  /* ---------- HOSPITAL ADMIN ---------- */
  {
    path: "/hospital-admin",
    element: <HospitalAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Hospital Admin Dashboard" /> },
      { path: "doctors", element: <Placeholder title="Doctors Management" /> },
      { path: "departments", element: <Placeholder title="Departments" /> },
      { path: "billing", element: <Placeholder title="Billing Overview" /> },
    ],
  },

  /* ---------- SUPER ADMIN ---------- */
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Super Admin Dashboard" /> },
      { path: "hospitals", element: <Placeholder title="Hospitals" /> },
      { path: "approvals", element: <Placeholder title="Approvals" /> },
      { path: "analytics", element: <Placeholder title="Analytics" /> },
      { path: "system-health", element: <Placeholder title="System Health" /> },
    ],
  },

  /* ---------- BILLING ---------- */
  {
    path: "/billing",
    element: <BillingLayout />,
    children: [
      { index: true, element: <Placeholder title="Billing Overview" /> },
      { path: "invoices", element: <Placeholder title="Invoices" /> },
      { path: "plans", element: <Placeholder title="Plans" /> },
    ],
  },

  /* ---------- AI ---------- */
  {
    path: "/ai",
    element: <AILayout />,
    children: [
      { index: true, element: <Placeholder title="AI Assistant" /> },
      { path: "history", element: <Placeholder title="AI History" /> },
      { path: "insights", element: <Placeholder title="AI Insights" /> },
    ],
  },

  /* ---------- FALLBACK ---------- */
  {
    path: "*",
    element: <ErrorLayout />,
  },
]);
