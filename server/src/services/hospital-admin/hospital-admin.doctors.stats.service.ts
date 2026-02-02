import { Types } from "mongoose";
import { DoctorModel } from "../../models/doctor";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";

interface DoctorStatsInput {
  hospitalId: Types.ObjectId;
}

export default class HospitalAdminDoctorsStatsService {
  static async getStats({ hospitalId }: DoctorStatsInput) {
    /**
     * =========================
     * DOCTOR BASIC STATS
     * =========================
     */
    const doctors = await DoctorModel.find(
      { hospitalId },
      { name: 1, email: 1, isActive: 1 }
    ).lean();

    const doctorIds = doctors.map(d => d._id);

    /**
     * =========================
     * APPOINTMENT AGGREGATION
     * =========================
     */
    const appointmentStats = await AppointmentModel.aggregate([
      {
        $match: {
          hospitalId,
          doctorId: { $in: doctorIds },
        },
      },
      {
        $group: {
          _id: "$doctorId",
          totalAppointments: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [
                { $eq: ["$status", AppointmentStatus.COMPLETED] },
                1,
                0,
              ],
            },
          },
          cancelled: {
            $sum: {
              $cond: [
                { $eq: ["$status", AppointmentStatus.CANCELLED] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = new Map(
      appointmentStats.map(s => [s._id.toString(), s])
    );

    /**
     * =========================
     * MERGE RESULT
     * =========================
     */
    const result = doctors.map(doc => {
      const stats = statsMap.get(doc._id.toString());

      return {
        doctorId: doc._id,
        name: doc.name,
        email: doc.email,
        isActive: doc.isActive,
        totalAppointments: stats?.totalAppointments ?? 0,
        completed: stats?.completed ?? 0,
        cancelled: stats?.cancelled ?? 0,
      };
    });

    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter(d => d.isActive).length,
      inactiveDoctors: doctors.filter(d => !d.isActive).length,
      doctors: result,
    };
  }
}
