import { Types } from "mongoose";
import bcrypt from "bcrypt";

import { DoctorModel } from "../../models/doctor";
import { CacheService } from "../../cache/cache.service";
import { CacheKeys } from "../../cache/cache.keys";
import { CacheTTL } from "../../cache/cache.ttl";
import { ENV } from "../../config/env";

/**
 * Doctor Service
 * --------------
 * Pure business logic layer.
 * ❌ No Express
 * ❌ No req / res
 * ✅ Handles hashing, DB, cache
 */
export default class DoctorService {
  /**
   * Create Doctor
   * 🔐 Password hashing handled here
   */
  static async create(payload: Record<string, unknown>) {
    /**
     * 1️⃣ Validate password presence
     */
    if (!payload.password) {
      throw new Error("Password is required");
    }

    /**
     * 2️⃣ Hash password
     */
    const passwordHash = await bcrypt.hash(
      String(payload.password),
      ENV.BCRYPT_SALT_ROUNDS
    );

    /**
     * 3️⃣ Remove raw password (security)
     */
    delete payload.password;

    /**
     * 4️⃣ Create doctor document
     */
    const doctor = new DoctorModel({
      ...payload,
      passwordHash, // ✅ REQUIRED by schema
    });

    const saved = await doctor.save();

    /**
     * 5️⃣ Invalidate doctor list cache
     */
    await CacheService.invalidateByPattern("doctor:list");

    return saved;
  }

  /**
   * Get Doctor by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

    return DoctorModel.findById(id).exec();
  }

  /**
   * Get all Doctors (CACHED)
   */
  static async getAll() {
    const cacheKey = CacheKeys.doctor.listByHospital("all");

    /**
     * 1️⃣ Try cache
     */
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      console.log("⚡ DOCTOR CACHE HIT");
      return cached;
    }

    console.log("🐢 DOCTOR CACHE MISS");

    /**
     * 2️⃣ DB query
     */
    const doctors = await DoctorModel.find().exec();

    /**
     * 3️⃣ Store in cache
     */
    await CacheService.set(
      cacheKey,
      doctors,
      CacheTTL.doctorList
    );

    return doctors;
  }

  /**
   * Update Doctor by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

    /**
     * 🔐 If password update requested → hash again
     */
    if (payload.password) {
      payload.passwordHash = await bcrypt.hash(
        String(payload.password),
        ENV.BCRYPT_SALT_ROUNDS
      );
      delete payload.password;
    }

    const updated = await DoctorModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();

    /**
     * Invalidate cache
     */
    await CacheService.invalidateByPattern("doctor:list");

    return updated;
  }

  /**
   * Delete Doctor by ID
   */
  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

    const deleted = await DoctorModel.findByIdAndDelete(id).exec();

    /**
     * Invalidate cache
     */
    await CacheService.invalidateByPattern("doctor:list");

    return deleted;
  }
}
