export const CacheKeys = {
  hospital: {
    list: (city?: string, active = true) =>
      `hospital:list:${city ?? "all"}:active=${active}`,
  },

  doctor: {
    listByHospital: (hospitalId: string) =>
      `doctor:list:hospital=${hospitalId}`,
    listBySpecialization: (spec: string) =>
      `doctor:list:spec=${spec}`,
  },

  appointment: {
    byDoctorDate: (doctorId: string, date: string) =>
      `appointment:doctor=${doctorId}:date=${date}`,
  },

  discovery: {
    search: (q: string) => `discovery:search:${q}`,
  },

  ai: {
    session: (sessionId: string) => `ai:session:${sessionId}`,
    usageByHospital: (hospitalId: string) =>
      `ai:usage:hospital=${hospitalId}`,
  },
};
