import { connectDB, disconnectDB } from "../../../../src/config";
import { DoctorModel } from "../../../../src/models/doctor";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { DOCTOR_STATUS } from "../../../../src/constants/status";
import { SYSTEM_ROLES } from "../../../../src/constants/roles";

async function seedDoctor() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) throw new Error("Hospital not found. Seed hospital first.");

  const admin = await HospitalAdminModel.findOne({
    hospitalId: hospital._id,
  });
  if (!admin) throw new Error("Hospital Admin not found. Seed admin first.");

  const exists = await DoctorModel.findOne({
    hospitalId: hospital._id,
    email: "doctor@hospital.com",
  });

  if (!exists) {
    await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr. John Doe",
      email: "doctor@hospital.com",
      phone: "+91-9000000000",
      specialization: "General Medicine",
      role: SYSTEM_ROLES.DOCTOR,
      status: DOCTOR_STATUS.ACTIVE,
    });

    console.log("✅ Doctor seeded");
  } else {
    console.log("ℹ️ Doctor already exists");
  }

  await disconnectDB();
}

seedDoctor()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
