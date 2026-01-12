import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { HospitalAdminModel } from "../../models/hospital-admin";
import { ENV } from "../../config/env";

/**
 * Hospital Admin Service
 * ----------------------
 * Pure business logic layer.
 * - Password hashing handled here
 * - No Express, no req/res
 */
export default class HospitalAdminService {
  /**
   * Create Hospital Admin
   */
  static async create(payload: Record<string, unknown>) {
    const { password, ...rest } = payload as {
      password?: string;
    };

    /**
     * 🔐 Password validation
     */
    if (!password) {
      throw new Error("Password is required");
    }

    /**
     * 🔐 Hash password (SERVER SIDE)
     */
    const passwordHash = await bcrypt.hash(
      password,
      ENV.BCRYPT_SALT_ROUNDS
    );

    /**
     * Create Hospital Admin with hashed password
     */
    const hospitalAdmin = new HospitalAdminModel({
      ...rest,
      passwordHash, // ✅ schema-required field
    });

    return hospitalAdmin.save();
  }

  /**
   * Get Hospital Admin by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    return HospitalAdminModel.findById(id).exec();
  }

  /**
   * Get all Hospital Admins
   */
  static async getAll() {
    return HospitalAdminModel.find().exec();
  }

  /**
   * Update Hospital Admin by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    /**
     * 🔐 If password update is requested, hash it
     */
    if (payload.password) {
      const hashed = await bcrypt.hash(
        payload.password as string,
        ENV.BCRYPT_SALT_ROUNDS
      );

      delete payload.password;
      payload.passwordHash = hashed;
    }

    return HospitalAdminModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Delete Hospital Admin by ID
   */
  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    return HospitalAdminModel.findByIdAndDelete(id).exec();
  }
}
