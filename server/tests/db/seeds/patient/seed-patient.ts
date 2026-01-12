import { connectDB, disconnectDB } from "../../../../src/config";

import { PatientModel } from "../../../../src/models/patient";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";

import { PatientStatus } from "../../../../src/constants/status";

async function seedPatient() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) {
    throw new Error("Hospital not found. Seed hospital first.");
  }

  const admin = await HospitalAdminModel.findOne({
    hospitalId: hospital._id,
  });
  if (!admin) {
    throw new Error("Hospital Admin not found. Seed admin first.");
  }

  const exists = await PatientModel.findOne({
    hospitalId: hospital._id,
    phone: "9999999999",
  });

  if (!exists) {
    await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,

      firstName: "Test",
      lastName: "Patient",

      phone: "9999999999",
      email: "patient@test.com",

      gender: "male",
      bloodGroup: "O+",

      emergencyContact: {
        name: "Emergency Contact",
        phone: "8888888888",
        relation: "Brother",
      },

      status: PatientStatus.ACTIVE,
    });

    console.log("✅ Patient seeded");
  } else {
    console.log("ℹ️ Patient already exists");
  }

  await disconnectDB();
}

seedPatient()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
