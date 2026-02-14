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
        title="AI Symptom Checker - Get Instant Medical Guidance"
        description="Describe your symptoms to our advanced AI and get personalized recommendations for doctors and hospitals near you. 24/7 available, 100% confidential."
        keywords="symptom checker, AI doctor, medical advice, healthcare, telemedicine"
      />

      <main className="ai-symptom-page">
        <div className="ai-symptom-page__container">
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
        </div>
      </main>
    </>
  );
}