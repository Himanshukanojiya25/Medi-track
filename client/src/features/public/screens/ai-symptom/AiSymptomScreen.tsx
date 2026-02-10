import { SeoShell } from "../../../../layouts/public/components/SeoShell";

import { AiSymptomIntro } from "./AiSymptomIntro";
import { AiSymptomChat } from "./AiSymptomChat";
import { AiSymptomResults } from "./AiSymptomResults";

import { usePublicAISymptom } from "../../hooks";

export function AiSymptomScreen() {
  const {
    step,
    symptomText,
    startAnalysis,
    submit,
    resetFlow,
  } = usePublicAISymptom();

  return (
    <>
      <SeoShell
        title="AI Symptom Checker"
        description="Describe your symptoms and get instant guidance."
      />

      <main className="ai-symptom-page">
        {step === "intro" && (
          <AiSymptomIntro
            onSubmit={(text) => startAnalysis(text)}
          />
        )}

        {step === "chat" && (
          <AiSymptomChat
            initialSymptom={symptomText}
            onComplete={() =>
              submit({
                symptoms: symptomText,
              })
            }
          />
        )}

        {step === "result" && (
          <AiSymptomResults
            onRestart={resetFlow}
          />
        )}
      </main>
    </>
  );
}
