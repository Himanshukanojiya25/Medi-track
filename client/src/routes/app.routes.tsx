import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./public.routes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Future */}
      {/* <Route path="/patient/*" element={<PatientRoutes />} /> */}
      {/* <Route path="/doctor/*" element={<DoctorRoutes />} /> */}
      {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
    </Routes>
  );
}
