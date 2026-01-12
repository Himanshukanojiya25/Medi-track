import bcrypt from "bcrypt";
import { connectDB, disconnectDB } from "../../../../src/config";
import { SuperAdminModel } from "../../../../src/models/super-admin";

async function seedSuperAdmin() {
  await connectDB();

  const exists = await SuperAdminModel.findOne({
    email: "admin@meditrack.com",
  });

  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await SuperAdminModel.create({
      email: "admin@meditrack.com",
      passwordHash,
    });

    console.log("✅ Super Admin seeded");
  } else {
    console.log("ℹ️ Super Admin already exists");
  }

  await disconnectDB();
}

seedSuperAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
