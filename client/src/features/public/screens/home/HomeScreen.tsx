import { SeoShell } from "../../../../layouts/public/components/SeoShell";

/* =========================
   HOME SECTIONS
========================= */
import { HomeHero } from "./HomeHero";
import { HomeFeatures } from "./HomeFeatures";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeTrust } from "./HomeTrust";
import { HomeEmergency } from "./HomeEmergency";

export function HomeScreen() {
  return (
    <>
      <SeoShell
        title="Find Doctors & Hospitals Near You | MediTrack"
        description="Discover trusted doctors, hospitals, and AI-powered health guidance to make better healthcare decisions."
      />

      {/* IMPORTANT: class fix */}
      <main className="home public-page">
        <HomeHero />
        <HomeFeatures />
        <HomeHowItWorks />
        <HomeTrust />
        <HomeEmergency />
      </main>
    </>
  );
}
