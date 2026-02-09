import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { SpecialityHeader } from "./SpecialityHeader";
import { SpecialityList } from "./SpecialityList";

export function SpecialityScreen() {
  return (
    <>
      <SeoShell
        title="Medical Specialities"
        description="Browse doctors and hospitals by medical specialities."
      />

      <main className="speciality-page">
        <SpecialityHeader />
        <SpecialityList />
      </main>
    </>
  );
}
