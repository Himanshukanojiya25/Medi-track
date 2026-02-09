import { httpClient } from "../api/http.client";
import { Hospital } from "../../types/hospital/hospital.types";

const BASE_URL = "/public/hospitals";

export const publicHospitalApi = {
  async getAll(params?: Record<string, unknown>) {
    const res = await httpClient.get<Hospital[]>(BASE_URL, { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await httpClient.get<Hospital>(`${BASE_URL}/${id}`);
    return res.data;
  },
};
