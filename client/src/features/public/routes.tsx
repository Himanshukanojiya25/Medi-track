// src/features/public/routes.ts

import { RouteObject } from "react-router-dom";

/* =========================
   PUBLIC SCREENS
========================= */
import {
  HomeScreen,
  DoctorsScreen,
  DoctorProfileScreen,
  HospitalsScreen,
  HospitalProfileScreen,
  SearchScreen,
  SpecialityScreen,
  FaqScreen,
  AboutScreen,
  ContactScreen,
  AiSymptomScreen,
  EmergencyScreen,
} from "./screens";

/* =========================
   PUBLIC ROUTES (FEATURE-LEVEL)
   Mounted under "/"
========================= */
export const publicRoutes: RouteObject[] = [
  /* ---------- HOME ---------- */
  {
    index: true,
    element: <HomeScreen />,
  },

  /* ---------- DOCTORS ---------- */
  {
    path: "doctors",
    element: <DoctorsScreen />,
  },
  {
    path: "doctors/:doctorId",
    element: <DoctorProfileScreen />,
  },

  /* ---------- HOSPITALS ---------- */
  {
    path: "hospitals",
    element: <HospitalsScreen />,
  },
  {
    path: "hospitals/:hospitalId",
    element: <HospitalProfileScreen />,
  },

  /* ---------- SEARCH & DISCOVERY ---------- */
  {
    path: "search",
    element: <SearchScreen />,
  },
  {
    path: "specialities",
    element: <SpecialityScreen />,
  },

  /* ---------- INFO PAGES ---------- */
  {
    path: "faq",
    element: <FaqScreen />,
  },
  {
    path: "about",
    element: <AboutScreen />,
  },
  {
    path: "contact",
    element: <ContactScreen />,
  },

  /* ---------- AI & EMERGENCY ---------- */
  {
    path: "ai-symptom",
    element: <AiSymptomScreen />,
  },
  {
    path: "emergency",
    element: <EmergencyScreen />,
  },
];
