import { Routes, Route } from "react-router-dom";
import { RequireAuth, RequireRole } from "./guards";

import { AuthLayout, DashboardLayout } from "../layouts";

/* ================= WEBSITE (PUBLIC) ================= */
import {
  HomePage,
  AboutPage,
  ContactPage,
  DoctorsPage,
  HospitalsPage,
} from "../pages";

/* ================= AUTH ================= */
import { LoginPage } from "../pages/auth";

/* ================= PATIENT (PRODUCT) ================= */
import { PatientHomePage } from "../pages/patient";

/* ================= PLACEHOLDER DASHBOARDS ================= */
const SuperAdminHome = () => <div>Super Admin Dashboard</div>;
const DoctorHome = () => <div>Doctor Dashboard</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= WEBSITE (PUBLIC) ================= */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ================= PATIENT (PROTECTED) ================= */}
      <Route element={<RequireAuth />}>
        <Route path="/patient" element={<PatientHomePage />} />
      </Route>

      {/* ================= DASHBOARDS (PROTECTED + ROLE) ================= */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          {/* SUPER ADMIN */}
          <Route
            element={<RequireRole allowedRoles={["SUPER_ADMIN"]} />}
          >
            <Route
              path="/super-admin"
              element={<SuperAdminHome />}
            />
          </Route>

          {/* DOCTOR */}
          <Route
            element={<RequireRole allowedRoles={["DOCTOR"]} />}
          >
            <Route path="/doctor" element={<DoctorHome />} />
          </Route>
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<div>404 — Not Found</div>} />
    </Routes>
  );
};
