// src/features/public/screens/emergency/EmergencyScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { EmergencyHeader } from "./EmergencyHeader";
import { EmergencyActions } from "./EmergencyActions";

export function EmergencyScreen() {
  return (
    <>
      <SeoShell
        title="Emergency Medical Help"
        description="Quick access to emergency medical services and nearby hospitals."
      />

      <main className="emergency-page">
        <EmergencyHeader />
        <EmergencyActions />
      </main>
    </>
  );
}
