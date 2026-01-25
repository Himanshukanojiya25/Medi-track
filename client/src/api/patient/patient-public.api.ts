// client/src/api/patient/patient-public.api.ts

import { apiClient } from "../client";
import { PATIENT_ENDPOINTS } from "./patient.endpoints";
import {
  Doctor,
  Hospital,
} from "../../services/patient/patient.types";

export const patientPublicAPI = {
  getDoctors: () => {
    return apiClient.get<Doctor[]>(PATIENT_ENDPOINTS.GET_DOCTORS);
  },

  getHospitals: () => {
    return apiClient.get<Hospital[]>(PATIENT_ENDPOINTS.GET_HOSPITALS);
  },
};
