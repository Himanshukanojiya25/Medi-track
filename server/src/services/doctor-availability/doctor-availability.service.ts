import { Types } from "mongoose";
import { DoctorAvailabilityModel } from "../../models/doctor-availability";

interface UpsertAvailabilityInput {
  doctorId: string; // from req.user or params
  slotDurationMinutes: number;
  weeklyAvailability: {
    dayOfWeek: number;
    slots: { start: string; end: string }[];
  }[];
}

/**
 * CREATE OR UPDATE (UPSERT) DOCTOR AVAILABILITY
 */
export async function upsertDoctorAvailabilityService(
  input: UpsertAvailabilityInput
) {
  const doctorObjectId = new Types.ObjectId(input.doctorId);

  const availability =
    await DoctorAvailabilityModel.findOneAndUpdate(
      { doctorId: doctorObjectId },
      {
        doctorId: doctorObjectId,
        slotDurationMinutes: input.slotDurationMinutes,
        weeklyAvailability: input.weeklyAvailability,
        isActive: true,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  return availability;
}

/**
 * GET DOCTOR AVAILABILITY
 */
export async function getDoctorAvailabilityService(doctorId: string) {
  return DoctorAvailabilityModel.findOne({
    doctorId: new Types.ObjectId(doctorId),
    isActive: true,
  });
}
