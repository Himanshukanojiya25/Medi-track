import { connectDB, disconnectDB } from "../../../../src/config";

import { AppointmentModel } from "../../../../src/models/appointment";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";

import { AppointmentStatus } from "../../../../src/constants/status";

async function seedAppointment() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) throw new Error("Hospital not found");

  const admin = await HospitalAdminModel.findOne({ hospitalId: hospital._id });
  if (!admin) throw new Error("Hospital Admin not found");

  const patient = await PatientModel.findOne({ hospitalId: hospital._id });
  if (!patient) throw new Error("Patient not found");

  const doctor = await DoctorModel.findOne({ hospitalId: hospital._id });
  if (!doctor) throw new Error("Doctor not found");

  const scheduledAt = new Date(Date.now() + 60 * 60 * 1000);

  const exists = await AppointmentModel.findOne({
    doctorId: doctor._id,
    scheduledAt,
  });

  if (!exists) {
    await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,

      scheduledAt,
      durationMinutes: 30,

      reason: "Routine checkup",
      status: AppointmentStatus.SCHEDULED,

      createdByHospitalAdminId: admin._id,
    });

    console.log("✅ Appointment seeded");
  } else {
    console.log("ℹ️ Appointment already exists");
  }

  await disconnectDB();
}

seedAppointment()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
