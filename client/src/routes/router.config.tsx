// client/src/routes/router.config.tsx

import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ProtectedRoute } from "../components/auth/role-guard/ProtectedRoute";
import { ROLES } from "../app/constants/role.constants";

/* =========================
   LAYOUTS
========================= */
import { PublicLayout }        from "../layouts/public/PublicLayout";
import { AuthLayout as PublicAuthLayout } from "../layouts/public/AuthLayout";
import { PatientLayout }       from "../layouts/patient/PatientLayout";
import { DoctorLayout }        from "../layouts/doctor/DoctorLayout";
import { HospitalAdminLayout } from "../layouts/hospital-admin/HospitalAdminLayout";
import { SuperAdminLayout }    from "../layouts/super-admin/SuperAdminLayout";
import { BillingLayout }       from "../layouts/billing/BillingLayout";
import { AILayout }            from "../layouts/ai/AILayout";
import { ErrorLayout }         from "../layouts/shared/ErrorLayout";

/* =========================
   PUBLIC SCREENS
========================= */
import { HomeScreen }            from "../features/public/screens/home";
import { SearchScreen }          from "../features/public/screens/search";
import { HospitalsScreen }       from "../features/public/screens/hospitals";
import { HospitalProfileScreen } from "../features/public/screens/hospital-profile";
import { DoctorsScreen }         from "../features/public/screens/doctors";
import { DoctorProfileScreen }   from "../features/public/screens/doctor-profile";
import { SpecialityScreen }      from "../features/public/screens/speciality";
import { FaqScreen }             from "../features/public/screens/faq";
import { AboutScreen }           from "../features/public/screens/about";
import { ContactScreen }         from "../features/public/screens/contact";
import { AiSymptomScreen }       from "../features/public/screens/ai-symptom";
import { EmergencyScreen }       from "../features/public/screens/emergency";

/* =========================
   AUTH SCREENS
========================= */
import { LoginScreen } from "../features/auth/login/screens";

/* =========================
   PATIENT SCREENS — all direct imports (no lazy)
========================= */
import { PatientDashboardScreen }     from "../features/patient/dashboard/PatientDashboardScreen";
import { ProfileScreen }              from "../features/patient/profile/ProfileScreen";
import { AppointmentsHistoryScreen }  from "../features/patient/appointments/history/AppointmentsHistoryScreen";
import { BookAppointmentScreen }      from "../features/patient/appointments/book/BookAppointmentScreen";
import AppointmentDetailScreen        from "../features/patient/appointments/AppointmentDetailScreen";
import { RescheduleAppointmentScreen } from "../features/patient/appointments/reschedule/RescheduleAppointmentScreen";
import { DoctorsListScreen } from "../features/patient/doctors/DoctorsListScreen";
import { PrescriptionsScreen } from "../features/patient/prescriptions";
import { DoctorDetailScreen } from "../features/patient/doctors/DoctorDetailScreen";
import { MedicalHistoryScreen } from "../features/patient/medical-history/MedicalHistoryScreen";
import { MedicalHistoryDetail } from "../features/patient/medical-history/MedicalHistoryDetail";
import { useParams, useNavigate } from "react-router-dom";
import { HospitalsListScreen } from "../features/patient/hospitals/HospitalsListScreen";
import { HospitalDetailScreen } from "../features/patient/hospitals/HospitalDetailScreen";
// import { DoctorDetailScreen } from "../features/patient/doctors/DoctorDetailScreen";

const MedicalHistoryDetailWrapper = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  
  return (
    <MedicalHistoryDetail 
      recordId={recordId || ""} 
      recordType="medical_history" 
      onBack={() => navigate(-1)} 
    />
  );
};
/* =========================
   LOADING FALLBACK
========================= */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/* =========================
   ROUTER
========================= */
export const appRouter = createBrowserRouter([

  // ── PUBLIC ────────────────────────────────────────────────────────────────
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true,                   element: <HomeScreen /> },
      { path: "search",                element: <SearchScreen /> },
      { path: "hospitals",             element: <HospitalsScreen /> },
      { path: "hospitals/:hospitalId", element: <HospitalProfileScreen /> },
      { path: "doctors",               element: <DoctorsScreen /> },
      { path: "doctors/:doctorId",     element: <DoctorProfileScreen /> },
      { path: "specialities",          element: <SpecialityScreen /> },
      { path: "faq",                   element: <FaqScreen /> },
      { path: "about",                 element: <AboutScreen /> },
      { path: "contact",               element: <ContactScreen /> },
      { path: "ai-symptom",            element: <AiSymptomScreen /> },
      { path: "emergency",             element: <EmergencyScreen /> },
      { path: "login",                 element: <LoginScreen /> },
    ],
  },

  // ── AUTH ──────────────────────────────────────────────────────────────────
  {
    path: "/auth",
    element: <PublicAuthLayout />,
    children: [
      { path: "login",           element: <LoginScreen /> },
      { path: "register",        element: <div>Register Page</div> },
      { path: "forgot-password", element: <div>Forgot Password</div> },
      { path: "reset-password",  element: <div>Reset Password</div> },
    ],
  },

{
  path: "/patient",
  element: (
    <Suspense fallback={<LoadingFallback />}>
      <ProtectedRoute allowedRoles={[ROLES.PATIENT]} />
    </Suspense>
  ),
  children: [
    {
      path: "",
      element: <PatientLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <PatientDashboardScreen /> },
        { path: "profile", element: <ProfileScreen /> },

        // ── Appointments ────────────────────────────────────────────────
        {
          path: "appointments",
          children: [
            { index: true, element: <AppointmentsHistoryScreen /> },
            { path: "book", element: <BookAppointmentScreen /> },
            { path: ":id", element: <AppointmentDetailScreen /> },
            { path: ":id/reschedule", element: <RescheduleAppointmentScreen /> },
          ],
        },

        // ── Doctors ─────────────────────────────────────────────────────
        {
          path: "doctors",
          children: [
            { index: true, element: <DoctorsListScreen /> },
            { path: ":doctorId", element: <DoctorDetailScreen /> },
          ],
        },

        // ── Hospitals ────────────────────────────────────────────────────
       {
  path: "hospitals",
  children: [
    { index: true, element: <HospitalsListScreen /> },
    { path: ":hospitalId", element: <HospitalDetailScreen /> },
  ],
},

        // ── Rest ─────────────────────────────────────────────────────────
        { path: "favorites", element: <div className="p-6"><h1 className="text-2xl font-bold">My Favorites</h1><p className="text-gray-500 mt-2">Coming soon…</p></div> },

       {
          path: "prescriptions",
          children: [
            { index: true, element: <PrescriptionsScreen /> },
            // Note: Detail view is handled inside PrescriptionsScreen (modal/detail view)
            // No separate route needed for :id because your component uses internal state
          ],
        },

       {
  path: "medical-history",
  children: [
    { index: true, element: <MedicalHistoryScreen /> },
    { path: ":recordId", element: <MedicalHistoryDetailWrapper /> },
  ],
},

        { path: "notifications", element: <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-gray-500 mt-2">Coming soon…</p></div> },
        { path: "uploads", element: <div className="p-6"><h1 className="text-2xl font-bold">Upload Reports</h1><p className="text-gray-500 mt-2">Coming soon…</p></div> },
        { path: "feedback", element: <div className="p-6"><h1 className="text-2xl font-bold">Feedback</h1><p className="text-gray-500 mt-2">Coming soon…</p></div> },
        { path: "settings", element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-500 mt-2">Coming soon…</p></div> },

        {
          path: "*",
          element: (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Page Not Found</h2>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>The page you're looking for doesn't exist.</p>
              <button
                onClick={() => (window.location.href = "/patient/dashboard")}
                style={{ padding: "10px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Go to Dashboard
              </button>
            </div>
          ),
        },
      ],
    },
  ],
},

  // ── DOCTOR ────────────────────────────────────────────────────────────────
  {
    path: "/doctor",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: <DoctorLayout />,
        children: [
          { index: true,                element: <Navigate to="dashboard" replace /> },
          { path: "dashboard",          element: <div>Doctor Dashboard</div> },
          { path: "appointments",       element: <div>Appointments</div> },
          { path: "appointments/today", element: <div>Today's Appointments</div> },
          { path: "appointments/:id",   element: <div>Appointment Details</div> },
          { path: "patients",           element: <div>Patients</div> },
          { path: "patients/:id",       element: <div>Patient Details</div> },
          { path: "prescriptions/new",  element: <div>New Prescription</div> },
          { path: "prescriptions",      element: <div>Prescription History</div> },
          { path: "availability",       element: <div>Manage Availability</div> },
          { path: "earnings",           element: <div>Earnings</div> },
          { path: "profile",            element: <div>Profile</div> },
          { path: "settings",           element: <div>Settings</div> },
        ],
      },
    ],
  },

  // ── HOSPITAL ADMIN ────────────────────────────────────────────────────────
  {
    path: "/hospital-admin",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={[ROLES.HOSPITAL_ADMIN]} />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: <HospitalAdminLayout />,
        children: [
          { index: true,                    element: <Navigate to="dashboard" replace /> },
          { path: "dashboard",              element: <div>Hospital Dashboard</div> },
          { path: "doctors",                element: <div>Manage Doctors</div> },
          { path: "doctors/add",            element: <div>Add Doctor</div> },
          { path: "doctors/:id",            element: <div>Doctor Details</div> },
          { path: "departments",            element: <div>Departments</div> },
          { path: "appointments",           element: <div>All Appointments</div> },
          { path: "patients",               element: <div>Patients</div> },
          { path: "billing",                element: <div>Billing</div> },
          { path: "reports",                element: <div>Reports</div> },
          { path: "staff",                  element: <div>Staff Management</div> },
          { path: "settings",               element: <div>Settings</div> },
        ],
      },
    ],
  },

  // ── SUPER ADMIN ───────────────────────────────────────────────────────────
  {
    path: "/super-admin",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: <SuperAdminLayout />,
        children: [
          { index: true,                     element: <Navigate to="dashboard" replace /> },
          { path: "dashboard",               element: <div>Super Admin Dashboard</div> },
          { path: "hospitals",               element: <div>Hospitals</div> },
          { path: "hospitals/approvals",     element: <div>Hospital Approvals</div> },
          { path: "doctors",                 element: <div>All Doctors</div> },
          { path: "users",                   element: <div>Users</div> },
          { path: "analytics",               element: <div>Analytics</div> },
          { path: "revenue",                 element: <div>Revenue</div> },
          { path: "system-health",           element: <div>System Health</div> },
          { path: "settings",               element: <div>Settings</div> },
        ],
      },
    ],
  },

  // ── BILLING ───────────────────────────────────────────────────────────────
  {
    path: "/billing",
    element: <BillingLayout />,
    children: [
      { index: true,        element: <div>Billing Dashboard</div> },
      { path: "invoices",   element: <div>Invoices</div> },
      { path: "invoices/:id", element: <div>Invoice Details</div> },
      { path: "payments",   element: <div>Payments</div> },
      { path: "subscriptions", element: <div>Subscriptions</div> },
    ],
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  {
    path: "/ai",
    element: <AILayout />,
    children: [
      { index: true,     element: <AiSymptomScreen /> },
      { path: "chat",    element: <div>AI Chat</div> },
      { path: "history", element: <div>Chat History</div> },
      { path: "insights", element: <div>AI Insights</div> },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  { path: "*", element: <ErrorLayout /> },
]);

export default appRouter;