type SuggestedDoctor = {
  id: string;
  name: string;
  speciality: string;
  experience: number;
};

type SuggestedHospital = {
  id: string;
  name: string;
  location: string;
};

export function usePublicAISymptomSuggestions() {
  // 🔹 MOCK DATA (Phase 1.4)
  const doctors: SuggestedDoctor[] = [
    {
      id: "d1",
      name: "Dr. Ananya Sharma",
      speciality: "General Physician",
      experience: 12,
    },
    {
      id: "d2",
      name: "Dr. Rahul Verma",
      speciality: "Internal Medicine",
      experience: 9,
    },
  ];

  const hospitals: SuggestedHospital[] = [
    {
      id: "h1",
      name: "City Care Hospital",
      location: "Indore",
    },
    {
      id: "h2",
      name: "LifeLine Multispeciality",
      location: "Indore",
    },
  ];

  const recommendedSpeciality = "General Physician";

  return {
    recommendedSpeciality,
    doctors,
    hospitals,
  };
}
