import bcrypt from "bcrypt";
import { ENV } from "../../config/env";
import { SuperAdminModel } from "../../models/super-admin";

/**
 * One-time super admin seed
 * ❗ Signup se create nahi hota
 */
export const seedSuperAdmin = async () => {
  const email = "himanshukanojiya27@gmail.com";

  // Already exist check
  const existing = await SuperAdminModel.findOne({ email });
  if (existing) {
    console.log("✅ Super Admin already exists");
    return;
  }

  // Password hash
  const hashedPassword = await bcrypt.hash(
    "Himanshu2500",
    ENV.BCRYPT_SALT_ROUNDS
  );

  // Create super admin
  await SuperAdminModel.create({
    email,
    passwordHash: hashedPassword,
    role: "SUPER_ADMIN",
    isActive: true,
  });

  console.log("🔥 Super Admin seeded successfully");
};
