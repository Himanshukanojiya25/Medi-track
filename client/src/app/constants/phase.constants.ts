export const PHASES = {
  PHASE_0: "phase_0_foundation",
  PHASE_1: "phase_1_public",
  PHASE_2: "phase_2_patient",
  PHASE_3: "phase_3_doctor",
  PHASE_4: "phase_4_hospital_admin",
  PHASE_5: "phase_5_billing",
  PHASE_6: "phase_6_ai",
  PHASE_7: "phase_7_super_admin",
} as const;

export type AppPhase = (typeof PHASES)[keyof typeof PHASES];

export const PHASE_ORDER: AppPhase[] = [
  PHASES.PHASE_0,
  PHASES.PHASE_1,
  PHASES.PHASE_2,
  PHASES.PHASE_3,
  PHASES.PHASE_4,
  PHASES.PHASE_5,
  PHASES.PHASE_6,
  PHASES.PHASE_7,
];
