import { ROLES, AppRole } from "../constants";

export const AI_ROLE_ACCESS: Record<
  AppRole,
  {
    enabled: boolean;
    dailyLimit: number;
  }
> = {
  public: { enabled: false, dailyLimit: 0 },
  patient: { enabled: true, dailyLimit: 10 },
  doctor: { enabled: true, dailyLimit: 50 },
  hospital_admin: { enabled: true, dailyLimit: 100 },
  super_admin: { enabled: true, dailyLimit: Infinity },
};
