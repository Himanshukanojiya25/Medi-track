// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryProvider } from "./app/providers/query.provider";  // ✅ Add this import
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryProvider>  {/* ✅ Wrap App with QueryProvider */}
        <App />
      </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>
);