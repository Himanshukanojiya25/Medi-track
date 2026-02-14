import { SeoShell } from "../../../../layouts/public/components/SeoShell/SeoShell";
import { PublicHero } from "../../components/hero"; // ✅ PublicHero import karo
// import { HomeHero } from "./HomeHero"; ❌ HomeHero hatao

import { HomeFeatures } from "./HomeFeatures";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeTrust } from "./HomeTrust";
import { HomeEmergency } from "./HomeEmergency";

export function HomeScreen() {
  return (
    <>
      <SeoShell
        title="Find Doctors & Hospitals Near You | MediTrack"
        description="Discover trusted doctors, hospitals, and AI-powered health guidance to make better healthcare decisions. India's most trusted healthcare platform."
        keywords="find doctors, book appointment, online doctor consultation, hospitals near me, healthcare india"
        image="/assets/og/home.jpg"
      />

      <main className="home">
        {/* ✅ Hero Section — PublicHero with glass morphism */}
        <PublicHero variant="default" />
        
        {/* Trust Indicators — Social Proof */}
        <HomeTrust />
        
        {/* Features — Value Proposition */}
        <HomeFeatures />
        
        {/* How It Works — Simple Steps */}
        <HomeHowItWorks />
        
        {/* Emergency CTA — Critical Care */}
        <HomeEmergency />
      </main>
    </>
  );
}