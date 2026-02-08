import { RouteObject } from "react-router-dom";

export const aiRoutes: RouteObject[] = [
  {
    path: "/ai",
    element: null, // AILayout
    children: [
      { index: true, element: null }, // AI Home / Widget
      { path: "chat", element: null },
      { path: "history", element: null },
      { path: "insights", element: null },
    ],
  },
];
