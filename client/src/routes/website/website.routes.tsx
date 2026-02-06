import { Routes, Route } from "react-router-dom";
import { WebsiteLayout } from "../../layouts/website/website.layout";

/**
 * TEMPORARY PLACEHOLDER PAGE
 * (jab tak Home page code nahi likhte)
 */
function TempHome() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-slate-800">
        MediTrack Website
      </h1>
      <p className="mt-4 text-slate-600">
        Public website layout is working perfectly 🚀
      </p>
    </div>
  );
}

export function WebsiteRoutes() {
  return (
    <WebsiteLayout>
      <Routes>
        <Route path="/" element={<TempHome />} />

        {/* Later ye routes replace honge */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/faq" element={<FaqPage />} /> */}
      </Routes>
    </WebsiteLayout>
  );
}
