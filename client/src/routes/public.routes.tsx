import { Routes, Route } from "react-router-dom";
import { WebsiteLayout } from "../../layouts/website/website.layout";

/**
 * TEMP PAGE — only to verify layout
 */
function TempHomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-slate-800">
        MediTrack Public Website
      </h1>
      <p className="mt-4 text-slate-600">
        Layout, header, footer, emergency banner are working ✅
      </p>
    </div>
  );
}

export function PublicRoutes() {
  return (
    <WebsiteLayout>
      <Routes>
        <Route path="/" element={<TempHomePage />} />

        {/* Phase-1 me baad me add honge */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/faq" element={<FaqPage />} /> */}
      </Routes>
    </WebsiteLayout>
  );
}
