import { PublicSearchParams, PublicSearchResult } from "../../types/public";
import { PublicDoctorService } from "./doctor-public.service";
import { PublicHospitalService } from "./hospital-public.service";

export class PublicSearchService {
  static async search(params: PublicSearchParams): Promise<PublicSearchResult> {
    const { query, location, speciality } = params;

    const [doctorsResult, hospitalsResult] = await Promise.all([
      PublicDoctorService.getList({
        speciality: speciality || query,
        page: 1,
        limit: 10,
      }),
      PublicHospitalService.getList({
        city: location || query,
        page: 1,
        limit: 10,
      }),
    ]);

    return {
      doctors: doctorsResult.items,
      hospitals: hospitalsResult.items,
    };
  }
}