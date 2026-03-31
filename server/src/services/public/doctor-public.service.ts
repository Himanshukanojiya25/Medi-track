import { Types } from "mongoose";
import { DoctorModel } from "../../models/doctor";
import { DoctorPublic, DoctorPublicListResponse } from "../../types/public";

export class PublicDoctorService {
  static async getList(query: {
    speciality?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<DoctorPublicListResponse> {
    const { speciality, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {
      isActive: true,
      status: "active",
    };

    if (speciality) {
      filter.specialization = { $regex: new RegExp(speciality, "i") };
    }

    const doctors = await DoctorModel.find(filter)
      .populate("hospitalId", "name address")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await DoctorModel.countDocuments(filter);

    const items: DoctorPublic[] = doctors.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      speciality: doc.specialization,
      experienceYears: this.calcExperience(doc.createdAt),
      rating: 4.5,
      reviewsCount: 0,
      consultationFee: 500,
      hospital: doc.hospitalId ? {
        id: (doc.hospitalId as any)._id.toString(),
        name: (doc.hospitalId as any).name,
        city: (doc.hospitalId as any).address?.city,
      } : undefined,
      avatarUrl: undefined,
      isAvailableToday: false,
    }));

    return { items, total };
  }

  static async getById(doctorId: string): Promise<any> {
    if (!Types.ObjectId.isValid(doctorId)) return null;

    const doctor = await DoctorModel.findById(doctorId)
      .populate("hospitalId", "name address")
      .lean();

    if (!doctor) return null;

    return {
      id: doctor._id.toString(),
      name: doctor.name,
      speciality: doctor.specialization,
      experienceYears: this.calcExperience(doctor.createdAt),
      rating: 4.5,
      reviewsCount: 0,
      consultationFee: 500,
      hospital: doctor.hospitalId ? {
        id: (doctor.hospitalId as any)._id.toString(),
        name: (doctor.hospitalId as any).name,
        city: (doctor.hospitalId as any).address?.city,
      } : undefined,
      avatarUrl: undefined,
      isAvailableToday: false,
    };
  }

  static async getReviews(doctorId: string, page: number = 1, limit: number = 10) {
    // TODO: Implement when Review model is ready
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  private static calcExperience(createdAt: Date): number {
    return Math.max(0, new Date().getFullYear() - createdAt.getFullYear());
  }
}