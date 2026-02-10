// src/routes/app.router.tsx

import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router.config";

export function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
