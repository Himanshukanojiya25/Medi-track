import { z } from "zod";

const timeSlotSchema = z.object({
  start: z.string().min(4),
  end: z.string().min(4),
});

const weeklyAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  slots: z.array(timeSlotSchema).min(1),
});

export const upsertDoctorAvailabilitySchema = z.object({
  body: z.object({
    slotDurationMinutes: z.number().int().min(5).max(120),
    weeklyAvailability: z.array(weeklyAvailabilitySchema).min(1),
  }),
});
