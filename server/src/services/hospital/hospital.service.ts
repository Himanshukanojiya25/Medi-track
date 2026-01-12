import { Types } from "mongoose";
import { HospitalModel } from "../../models/hospital";
import { CacheService } from "../../cache/cache.service";
import { CacheKeys } from "../../cache/cache.keys";
import { CacheTTL } from "../../cache/cache.ttl";

/**
 * Hospital Service
 * ----------------
 * Pure business logic layer.
 * No Express, no req/res.
 */
export default class HospitalService {
  /**
   * Create Hospital
   */
  static async create(payload: Record<string, unknown>) {
    const hospital = new HospitalModel(payload);
    const saved = await hospital.save();

    // Invalidate hospital listings cache
    await CacheService.invalidateByPattern("hospital:list");

    return saved;
  }

  /**
   * Get Hospital by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }

    return HospitalModel.findById(id).exec();
  }

  /**
   * Get all Hospitals (CACHED)
   */
  static async getAll() {
    const cacheKey = CacheKeys.hospital.list();

    // 1️⃣ Try cache first
  const cached = await CacheService.get(cacheKey);
if (cached) {
  console.log("⚡ HOSPITAL CACHE HIT");
  return cached;
}

console.log("🐢 HOSPITAL CACHE MISS");


    // 2️⃣ DB query
    const hospitals = await HospitalModel.find().exec();

    // 3️⃣ Store in cache
    await CacheService.set(
      cacheKey,
      hospitals,
      CacheTTL.hospitalList
    );

    return hospitals;
  }

  /**
   * Update Hospital by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }

    const updated = await HospitalModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();

    // Invalidate hospital listings cache
    await CacheService.invalidateByPattern("hospital:list");

    return updated;
  }

  /**
   * Deactivate Hospital (soft control via status)
   */
  static async deactivateById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }

    const updated = await HospitalModel.findByIdAndUpdate(
      id,
      { status: "INACTIVE" },
      { new: true }
    ).exec();

    // Invalidate hospital listings cache
    await CacheService.invalidateByPattern("hospital:list");

    return updated;
  }
}
