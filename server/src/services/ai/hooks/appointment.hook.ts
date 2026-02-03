import { AppointmentModel } from "../../../models/appointment";

/**
 * ============================
 * APPOINTMENT HOOK
 * ============================
 * Responsibility:
 * - Collect appointment-related signals
 * - NO business rules
 * - NO mutation
 */
export async function appointmentHook(params: {
  hospitalId: string;
  actorId?: string;
  actorRole: "patient" | "doctor" | "hospital_admin";
}) {
  const { hospitalId, actorId, actorRole } = params;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const baseQuery: any = {
    hospitalId,
    createdAt: { $gte: todayStart, $lte: todayEnd },
  };

  if (actorRole === "patient" && actorId) {
    baseQuery.patientId = actorId;
  }

  if (actorRole === "doctor" && actorId) {
    baseQuery.doctorId = actorId;
  }

  const [todayCount, canceledCount, completedCount] =
    await Promise.all([
      AppointmentModel.countDocuments(baseQuery),
      AppointmentModel.countDocuments({
        ...baseQuery,
        status: "cancelled",
      }),
      AppointmentModel.countDocuments({
        ...baseQuery,
        status: "completed",
      }),
    ]);

  return {
    todayCount,
    canceledCount,
    completedCount,
  };
}
