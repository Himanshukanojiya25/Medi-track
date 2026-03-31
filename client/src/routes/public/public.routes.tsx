import { RouteObject } from "react-router-dom";
import { PublicLayout } from "../../layouts/public/PublicLayout";

// Public Screens
import { HomeScreen } from "../../features/public/screens/home";
import { DoctorsScreen } from "../../features/public/screens/doctors";
import { HospitalsScreen } from "../../features/public/screens/hospitals";
import { DoctorProfileScreen } from "../../features/public/screens/doctor-profile";
import { HospitalProfileScreen } from "../../features/public/screens/hospital-profile";
import { SpecialityScreen } from "../../features/public/screens/speciality";
import { FaqScreen } from "../../features/public/screens/faq";
import { AboutScreen } from "../../features/public/screens/about";
import { ContactScreen } from "../../features/public/screens/contact";
import { AiSymptomScreen } from "../../features/public/screens/ai-symptom";
import { EmergencyScreen } from "../../features/public/screens/emergency";

// 👈 AUTH SCREENS
import { LoginScreen } from "../../features/auth/login/screens";

export const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      // Home
      { index: true, element: <HomeScreen /> },

      // Doctors
      { path: "doctors", element: <DoctorsScreen /> },
      { path: "doctors/:doctorId", element: <DoctorProfileScreen /> },

      // Hospitals
      { path: "hospitals", element: <HospitalsScreen /> },
      { path: "hospitals/:hospitalId", element: <HospitalProfileScreen /> },

      // Discovery
      { path: "specialities", element: <SpecialityScreen /> },

      // Info Pages
      { path: "faq", element: <FaqScreen /> },
      { path: "about", element: <AboutScreen /> },
      { path: "contact", element: <ContactScreen /> },

      // AI & Emergency
      { path: "ai-symptom", element: <AiSymptomScreen /> },
      { path: "emergency", element: <EmergencyScreen /> },

      // 👈 AUTH ROUTES
      { path: "login", element: <LoginScreen /> },
    ],
  },
];