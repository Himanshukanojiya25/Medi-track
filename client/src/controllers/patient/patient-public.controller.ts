// client/src/controllers/patient/patient-public.controller.ts

import { patientPublicService } from "../../services/patient";
import { Doctor, Hospital } from "../../services/patient";

export const patientPublicController = {
  async getDoctors(): Promise<Doctor[]> {
    return patientPublicService.fetchDoctors();
  },

  async getHospitals(): Promise<Hospital[]> {
    return patientPublicService.fetchHospitals();
  },
};
