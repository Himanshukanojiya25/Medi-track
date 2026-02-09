import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { AiSymptomIntro } from "./AiSymptomIntro";

export function AiSymptomScreen() {
  return (
    <>
      <SeoShell
        title="AI Symptom Checker"
        description="Describe your symptoms and get instant guidance."
      />

      <main className="ai-symptom-page">
        <AiSymptomIntro />
      </main>
    </>
  );
}
