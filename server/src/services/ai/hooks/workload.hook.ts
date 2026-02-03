import { AppointmentModel } from "../../../models/appointment";

/**
 * ============================
 * WORKLOAD HOOK
 * ============================
 * Signals:
 * - Doctor load
 * - Admin insights
 */
export async function workloadHook(params: {
  hospitalId: string;
  doctorId: string;
}) {
  const { hospitalId, doctorId } = params;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [dailyAppointments, weeklyAppointments] =
    await Promise.all([
      AppointmentModel.countDocuments({
        hospitalId,
        doctorId,
        createdAt: {
          $gte: new Date(
            new Date().setHours(0, 0, 0, 0),
          ),
        },
      }),
      AppointmentModel.countDocuments({
        hospitalId,
        doctorId,
        createdAt: { $gte: weekStart },
      }),
    ]);

  return {
    dailyAppointments,
    weeklyAppointments,
  };
}
