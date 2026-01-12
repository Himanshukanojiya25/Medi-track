import bcrypt from "bcrypt";
import { connectDB, disconnectDB } from "../../../../src/config";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { HospitalModel } from "../../../../src/models/hospital";
import { SYSTEM_ROLES } from "../../../../src/constants/roles";

async function seedHospitalAdmin() {
  await connectDB();

  const hospital = await HospitalModel.findOne({ code: "HOSP001" });
  if (!hospital) {
    throw new Error("Hospital not found. Seed hospital first.");
  }

  const exists = await HospitalAdminModel.findOne({
    hospitalId: hospital._id,
    email: "admin@hospital.com",
  });

  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await HospitalAdminModel.create({
      hospitalId: hospital._id,
      name: "Hospital Admin",
      email: "admin@hospital.com",
      passwordHash,
      role: SYSTEM_ROLES.HOSPITAL_ADMIN,
    });

    console.log("✅ Hospital Admin seeded");
  } else {
    console.log("ℹ️ Hospital Admin already exists");
  }

  await disconnectDB();
}

seedHospitalAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
