// src/routes/router.config.ts

import { createBrowserRouter } from "react-router-dom";

/* =========================
   LAYOUTS
========================= */
import { PublicLayout } from "../layouts/public/PublicLayout";
import { AuthLayout as PublicAuthLayout } from "../layouts/public/AuthLayout";
// ✅ Remove this line - it's not being used
// import { AuthLayout } from "../layouts/auth/AuthLayout";
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
   ROUTER CONFIG - React Router v6 (No Future Flags)
========================= */
export const appRouter = createBrowserRouter([
  // PUBLIC ROUTES
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

  // AUTH ROUTES
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

  // PATIENT ROUTES
  {
    path: "/patient",
    element: <PatientLayout />,
    children: [
      { index: true, element: <Placeholder title="Patient Dashboard" /> },
      { path: "appointments", element: <Placeholder title="My Appointments" /> },
      { path: "appointments/book", element: <Placeholder title="Book Appointment" /> },
      { path: "appointments/:id", element: <Placeholder title="Appointment Details" /> },
      { path: "doctors", element: <Placeholder title="My Doctors" /> },
      { path: "hospitals", element: <Placeholder title="My Hospitals" /> },
      { path: "prescriptions", element: <Placeholder title="Prescriptions" /> },
      { path: "prescriptions/:id", element: <Placeholder title="Prescription Details" /> },
      { path: "medical-records", element: <Placeholder title="Medical Records" /> },
      { path: "profile", element: <Placeholder title="Profile" /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  },

  // DOCTOR ROUTES
  {
    path: "/doctor",
    element: <DoctorLayout />,
    children: [
      { index: true, element: <Placeholder title="Doctor Dashboard" /> },
      { path: "appointments", element: <Placeholder title="Appointments" /> },
      { path: "appointments/today", element: <Placeholder title="Today's Appointments" /> },
      { path: "appointments/:id", element: <Placeholder title="Appointment Details" /> },
      { path: "patients", element: <Placeholder title="Patients" /> },
      { path: "patients/:id", element: <Placeholder title="Patient Details" /> },
      { path: "prescriptions/new", element: <Placeholder title="New Prescription" /> },
      { path: "prescriptions", element: <Placeholder title="Prescription History" /> },
      { path: "availability", element: <Placeholder title="Manage Availability" /> },
      { path: "earnings", element: <Placeholder title="Earnings" /> },
      { path: "profile", element: <Placeholder title="Profile" /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  },

  // HOSPITAL ADMIN ROUTES
  {
    path: "/hospital-admin",
    element: <HospitalAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Hospital Dashboard" /> },
      { path: "doctors", element: <Placeholder title="Manage Doctors" /> },
      { path: "doctors/add", element: <Placeholder title="Add Doctor" /> },
      { path: "doctors/:id", element: <Placeholder title="Doctor Details" /> },
      { path: "departments", element: <Placeholder title="Departments" /> },
      { path: "appointments", element: <Placeholder title="All Appointments" /> },
      { path: "patients", element: <Placeholder title="Patients" /> },
      { path: "billing", element: <Placeholder title="Billing" /> },
      { path: "reports", element: <Placeholder title="Reports" /> },
      { path: "staff", element: <Placeholder title="Staff Management" /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  },

  // SUPER ADMIN ROUTES
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Super Admin Dashboard" /> },
      { path: "hospitals", element: <Placeholder title="Hospitals" /> },
      { path: "hospitals/approvals", element: <Placeholder title="Hospital Approvals" /> },
      { path: "doctors", element: <Placeholder title="All Doctors" /> },
      { path: "users", element: <Placeholder title="Users" /> },
      { path: "analytics", element: <Placeholder title="Analytics" /> },
      { path: "revenue", element: <Placeholder title="Revenue" /> },
      { path: "system-health", element: <Placeholder title="System Health" /> },
      { path: "settings", element: <Placeholder title="Settings" /> },
    ],
  },

  // BILLING ROUTES
  {
    path: "/billing",
    element: <BillingLayout />,
    children: [
      { index: true, element: <Placeholder title="Billing Dashboard" /> },
      { path: "invoices", element: <Placeholder title="Invoices" /> },
      { path: "invoices/:id", element: <Placeholder title="Invoice Details" /> },
      { path: "payments", element: <Placeholder title="Payments" /> },
      { path: "subscriptions", element: <Placeholder title="Subscriptions" /> },
    ],
  },

  // AI ROUTES
  {
    path: "/ai",
    element: <AILayout />,
    children: [
      { index: true, element: <AiSymptomScreen /> },
      { path: "chat", element: <Placeholder title="AI Chat" /> },
      { path: "history", element: <Placeholder title="Chat History" /> },
      { path: "insights", element: <Placeholder title="AI Insights" /> },
    ],
  },

  // 404 - NOT FOUND
  {
    path: "*",
    element: <ErrorLayout />,
  },
]);

// Export for use in main.tsx
export default appRouter;