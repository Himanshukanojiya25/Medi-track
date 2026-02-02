import { z } from "zod";
import { AppointmentStatus } from "../../constants/status";

export const DoctorAppointmentsQuerySchema = z.object({
  date: z.enum(["today", "upcoming", "past"]).optional(),

  status: z.nativeEnum(AppointmentStatus).optional(),

  from: z
    .string()
    .datetime()
    .optional(),

  to: z
    .string()
    .datetime()
    .optional(),
});
