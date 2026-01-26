import { Request, Response } from "express";
import {
  upsertDoctorAvailabilityService,
  getDoctorAvailabilityService,
} from "../../services/doctor-availability/doctor-availability.service";

/**
 * UPSERT AVAILABILITY (DOCTOR)
 */
export async function upsertDoctorAvailabilityController(
  req: Request,
  res: Response
) {
  const doctorId = req.user!.id; // doctor only

  const availability = await upsertDoctorAvailabilityService({
    doctorId,
    ...req.body,
  });

  return res.status(200).json({
    success: true,
    data: availability,
  });
}

/**
 * GET AVAILABILITY (PUBLIC / PATIENT)
 */
export async function getDoctorAvailabilityController(
  req: Request,
  res: Response
) {
  const { doctorId } = req.params;

  const availability = await getDoctorAvailabilityService(doctorId);

  return res.status(200).json({
    success: true,
    data: availability,
  });
}
