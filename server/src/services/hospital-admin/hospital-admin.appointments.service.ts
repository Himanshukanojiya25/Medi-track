import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";

interface ListAppointmentsInput {
  hospitalId: Types.ObjectId;
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  doctorId?: Types.ObjectId;
  from?: Date;
  to?: Date;
}

export default class HospitalAdminAppointmentsService {
  static async list(payload: ListAppointmentsInput) {
    const {
      hospitalId,
      page = 1,
      limit = 20,
      status,
      doctorId,
      from,
      to,
    } = payload;

    const query: any = {
      hospitalId,
    };

    if (status) {
      query.status = status;
    }

    if (doctorId) {
      query.doctorId = doctorId;
    }

    if (from || to) {
      query.scheduledAt = {};
      if (from) query.scheduledAt.$gte = from;
      if (to) query.scheduledAt.$lte = to;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      AppointmentModel.find(query)
        .populate("doctorId", "name email")
        .populate("patientId", "name email")
        .sort({ scheduledAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      AppointmentModel.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
