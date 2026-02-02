import { Types } from "mongoose";
import { DoctorModel } from "../../models/doctor";
import { PatientModel } from "../../models/patient";
import { HttpError } from "../../utils/response/http-error";

export default class HospitalAdminUsersControlService {
  /**
   * =========================
   * DOCTOR CONTROL
   * =========================
   */
  static async updateDoctorStatus(params: {
    hospitalId: Types.ObjectId;
    doctorId: Types.ObjectId;
    isActive: boolean;
  }) {
    const doctor = await DoctorModel.findOne({
      _id: params.doctorId,
      hospitalId: params.hospitalId,
    });

    if (!doctor) {
      throw new HttpError("Doctor not found", 404);
    }

    doctor.isActive = params.isActive;
    await doctor.save();

    return doctor;
  }

  /**
   * =========================
   * PATIENT CONTROL
   * =========================
   */
  static async updatePatientStatus(params: {
    hospitalId: Types.ObjectId;
    patientId: Types.ObjectId;
    isBlocked: boolean;
  }) {
    const patient = await PatientModel.findOne({
      _id: params.patientId,
      hospitalId: params.hospitalId,
    });

    if (!patient) {
      throw new HttpError("Patient not found", 404);
    }

    patient.isBlocked = params.isBlocked;
    await patient.save();

    return patient;
  }
}
