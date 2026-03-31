import { Types } from "mongoose";
import { HospitalModel } from "../../models/hospital";
import { DoctorModel } from "../../models/doctor";
import { HospitalPublic, HospitalPublicListResponse } from "../../types/public";
import { DOCTOR_STATUS } from "../../constants/status";

export class PublicHospitalService {
  static async getList(query: {
    city?: string;
    department?: string;
    page?: number;
    limit?: number;
  }): Promise<HospitalPublicListResponse> {
    const { city, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {
      isActive: true,
      status: "active",
    };

    if (city) {
      filter["address.city"] = { $regex: new RegExp(city, "i") };
    }

    const hospitals = await HospitalModel.find(filter)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await HospitalModel.countDocuments(filter);

    const items: HospitalPublic[] = hospitals.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      city: h.address?.city || "",
      address: h.address?.line1,
      departments: [],
      rating: 4.0,
      reviewsCount: 0,
      logoUrl: undefined,
      isEmergencyAvailable: false,
    }));

    return { items, total };
  }

  static async getById(hospitalId: string): Promise<any> {
    if (!Types.ObjectId.isValid(hospitalId)) return null;

    const hospital = await HospitalModel.findById(hospitalId).lean();
    if (!hospital) return null;

    const doctors = await DoctorModel.find({
      hospitalId: new Types.ObjectId(hospitalId),
      isActive: true,
      status: DOCTOR_STATUS.ACTIVE,
    })
      .select("name specialization")
      .limit(10)
      .lean();

    return {
      id: hospital._id.toString(),
      name: hospital.name,
      city: hospital.address?.city || "",
      address: hospital.address?.line1,
      departments: [],
      rating: 4.0,
      reviewsCount: 0,
      logoUrl: undefined,
      isEmergencyAvailable: false,
      doctors: doctors.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        speciality: d.specialization,
      })),
    };
  }

  static async getDoctors(hospitalId: string, page: number = 1, limit: number = 10) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      return { items: [], total: 0, page, limit };
    }

    const skip = (page - 1) * limit;

    const doctors = await DoctorModel.find({
      hospitalId: new Types.ObjectId(hospitalId),
      isActive: true,
      status: DOCTOR_STATUS.ACTIVE,
    })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await DoctorModel.countDocuments({
      hospitalId: new Types.ObjectId(hospitalId),
      isActive: true,
      status: DOCTOR_STATUS.ACTIVE,
    });

    const items = doctors.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      speciality: d.specialization,
      experienceYears: Math.max(0, new Date().getFullYear() - d.createdAt.getFullYear()),
    }));

    return { items, total, page, limit };
  }
}