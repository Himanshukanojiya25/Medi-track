import { PrescriptionModel } from "../../../models/prescription";

/**
 * ============================
 * PRESCRIPTION HOOK
 * ============================
 * Signals:
 * - Recent prescriptions
 * - Used for education / follow-ups
 */
export async function prescriptionHook(params: {
  hospitalId: string;
  doctorId?: string;
  patientId?: string;
}) {
  const { hospitalId, doctorId, patientId } = params;

  const query: any = { hospitalId };

  if (doctorId) query.doctorId = doctorId;
  if (patientId) query.patientId = patientId;

  const lastPrescription =
    await PrescriptionModel.findOne(query)
      .sort({ createdAt: -1 })
      .select("_id createdAt")
      .lean();

  return {
    lastPrescriptionAt: lastPrescription?.createdAt,
  };
}
