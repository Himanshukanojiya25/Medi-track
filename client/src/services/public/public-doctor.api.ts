import { httpClient } from "../api/http.client";
import { Doctor } from "../../types/doctor/doctor.types";

const BASE_URL = "/public/doctors";

export const publicDoctorApi = {
  async getAll(params?: Record<string, unknown>) {
    const res = await httpClient.get<Doctor[]>(BASE_URL, { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await httpClient.get<Doctor>(`${BASE_URL}/${id}`);
    return res.data;
  },
};
