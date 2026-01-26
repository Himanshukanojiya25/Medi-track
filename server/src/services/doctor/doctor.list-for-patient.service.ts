import { Types } from "mongoose";
import { DoctorModel } from "../../models/doctor";
import { DOCTOR_STATUS } from "../../constants/status";

interface ListInput {
  hospitalId: string;
  departmentId?: string;
}

class DoctorListForPatientService {
  static async list(input: ListInput) {
    const { hospitalId, departmentId } = input;

    if (!Types.ObjectId.isValid(hospitalId)) {
      return [];
    }

    const filter: any = {
      hospitalId,
      isActive: true,
      status: DOCTOR_STATUS.ACTIVE,
    };

    if (departmentId) {
      if (!Types.ObjectId.isValid(departmentId)) return [];
      filter.departmentId = departmentId;
    }

    const doctors = await DoctorModel.find(filter)
      .select("_id hospitalId name specialization")
      .lean();

    return doctors;
  }
}

export default DoctorListForPatientService;
