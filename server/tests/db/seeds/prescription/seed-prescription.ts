import { connectDB, disconnectDB } from "../../../../src/config";

import { PrescriptionModel } from "../../../../src/models/prescription";
import { HospitalModel } from "../../../../src/models/hospital";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";
import { AppointmentModel } from "../../../../src/models/appointment";

import { PrescriptionStatus } from "../../../../src/constants/status";

async function seedPrescription() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) throw new Error("Hospital not found");

  const patient = await PatientModel.findOne({ hospitalId: hospital._id });
  if (!patient) throw new Error("Patient not found");

  const doctor = await DoctorModel.findOne({ hospitalId: hospital._id });
  if (!doctor) throw new Error("Doctor not found");

  const appointment = await AppointmentModel.findOne({ hospitalId: hospital._id });

  const exists = await PrescriptionModel.findOne({
    hospitalId: hospital._id,
    patientId: patient._id,
    doctorId: doctor._id,
    appointmentId: appointment?._id,
    status: PrescriptionStatus.ACTIVE,
  });

  if (!exists) {
    await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentId: appointment?._id,

      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2 times a day",
          durationDays: 5,
          instructions: "After meals",
        },
      ],

      notes: "General fever treatment",
      status: PrescriptionStatus.ACTIVE,
    });

    console.log("✅ Prescription seeded");
  } else {
    console.log("ℹ️ Prescription already exists");
  }

  await disconnectDB();
}

seedPrescription()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
