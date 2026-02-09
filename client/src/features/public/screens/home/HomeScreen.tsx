// src/features/public/screens/home/HomeScreen.tsx

import { PublicHero } from "../../components/hero";
import { TrustBanner } from "../../components/banners";
import { EmergencyBanner } from "../../components/banners";
import { SeoShell } from "../../../../layouts/public/components/SeoShell";

export function HomeScreen() {
  return (
    <>
      <SeoShell
        title="Find Doctors & Hospitals Near You"
        description="Discover trusted doctors, hospitals, and AI-powered health guidance near you."
      />

      <main>
        <PublicHero />
        <TrustBanner />
        <EmergencyBanner phoneNumber="108" />
      </main>
    </>
  );
}
