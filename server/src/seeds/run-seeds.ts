import { connectDB } from "../config/mongoose";
import { seedSuperAdmin } from "./super-admin";

const runSeeds = async () => {
  try {
    console.log("🌱 Running seeds...");

    await connectDB();

    await seedSuperAdmin();

    console.log("✅ All seeds completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

runSeeds();
