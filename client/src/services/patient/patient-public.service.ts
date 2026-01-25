// client/src/services/patient/patient-public.service.ts

import { patientPublicAPI } from "../../api/patient";
import { Doctor, Hospital } from "./patient.types";

export const patientPublicService = {
  async fetchDoctors(): Promise<Doctor[]> {
    const res = await patientPublicAPI.getDoctors();
    return res.data;
  },

  async fetchHospitals(): Promise<Hospital[]> {
    const res = await patientPublicAPI.getHospitals();
    return res.data;
  },
};
