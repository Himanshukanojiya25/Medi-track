import { connectDB, disconnectDB } from "../../../../src/config";
import { HospitalModel } from "../../../../src/models/hospital";
import { HOSPITAL_STATUS } from "../../../../src/constants/status";

async function seedHospital() {
  await connectDB();

  const exists = await HospitalModel.findOne({ code: "HOSP001" });

  if (!exists) {
    await HospitalModel.create({
      name: "MediTrack General Hospital",
      code: "HOSP001",
      email: "contact@meditrackhospital.com",
      phone: "+91-9999999999",
      status: HOSPITAL_STATUS.ACTIVE,
      address: {
        line1: "Main Road",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
      },
    });

    console.log("✅ Hospital seeded");
  } else {
    console.log("ℹ️ Hospital already exists");
  }

  await disconnectDB();
}

seedHospital()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
