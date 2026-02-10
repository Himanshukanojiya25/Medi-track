// src/features/public/screens/speciality/SpecialityScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { SpecialityHeader } from "./SpecialityHeader";
import { SpecialityList } from "./SpecialityList";

export function SpecialityScreen() {
  return (
    <>
      <SeoShell
        title="Medical Specialities | MediTrack"
        description="Browse doctors and hospitals by medical specialities and find the right healthcare expert."
      />

      <main className="speciality-page search-page">
        <SpecialityHeader />
        <SpecialityList />
      </main>
    </>
  );
}
