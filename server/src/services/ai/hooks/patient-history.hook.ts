import { AppointmentModel } from "../../../models/appointment";

/**
 * ============================
 * PATIENT HISTORY HOOK
 * ============================
 * Signals:
 * - Missed appointments
 * - Last visit date
 */
export async function patientHistoryHook(params: {
  hospitalId: string;
  patientId: string;
}) {
  const { hospitalId, patientId } = params;

  const [lastVisit, missedAppointments] =
    await Promise.all([
      AppointmentModel.findOne({
        hospitalId,
        patientId,
        status: "completed",
      })
        .sort({ createdAt: -1 })
        .select("createdAt")
        .lean(),

      AppointmentModel.countDocuments({
        hospitalId,
        patientId,
        status: "cancelled",
      }),
    ]);

  return {
    lastVisitAt: lastVisit?.createdAt,
    missedAppointments,
  };
}
