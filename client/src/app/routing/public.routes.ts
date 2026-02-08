import { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: null, // PublicLayout later
    children: [
      { index: true, element: null }, // Home
      { path: "hospitals", element: null },
      { path: "hospitals/:hospitalId", element: null },
      { path: "doctors", element: null },
      { path: "doctors/:doctorId", element: null },
      { path: "search", element: null },
      { path: "ai-symptom", element: null },
      { path: "about", element: null },
      { path: "contact", element: null },
      { path: "faq", element: null },
    ],
  },
];
