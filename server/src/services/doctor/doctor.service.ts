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
   * ============================
   * CREATE DOCTOR (Hospital Admin)
   * ============================
   */
  static async create(payload: Record<string, unknown>) {
    if (!payload.password) {
      throw new Error("Password is required");
    }

    const passwordHash = await bcrypt.hash(
      String(payload.password),
      ENV.BCRYPT_SALT_ROUNDS
    );

    delete payload.password;

    const doctor = new DoctorModel({
      ...payload,
      passwordHash,
    });

    const saved = await doctor.save();

    // Invalidate all doctor lists
    await CacheService.invalidateByPattern("doctor:list");

    return saved;
  }

  /**
   * ============================
   * GET DOCTOR BY ID
   * ============================
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

    return DoctorModel.findById(id).exec();
  }

  /**
   * ============================
   * GET ALL DOCTORS (ADMIN USE)
   * ============================
   */
  static async getAll() {
    const cacheKey = CacheKeys.doctor.listByHospital("all");

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const doctors = await DoctorModel.find().exec();

    await CacheService.set(
      cacheKey,
      doctors,
      CacheTTL.doctorList
    );

    return doctors;
  }

  /**
   * ============================
   * 🔥 OPTION A: GET DOCTORS FOR PATIENTS
   * ============================
   * Public / Patient-safe listing
   */
  static async getDoctorsForPatients(filters: {
    departmentId?: string;
    hospitalId?: string;
  }) {
    const query: any = {
      isActive: true,
    };

    if (filters.hospitalId) {
      query.hospitalId = filters.hospitalId;
    }

    if (filters.departmentId) {
      query.departmentIds = filters.departmentId;
    }

    const cacheKey = CacheKeys.doctor.listByHospital(
      `${filters.hospitalId || "all"}:${filters.departmentId || "all"}`
    );

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const doctors = await DoctorModel.find(query)
      .select("name specialization hospitalId departmentIds")
      .lean();

    await CacheService.set(
      cacheKey,
      doctors,
      CacheTTL.doctorList
    );

    return doctors;
  }

  /**
   * ============================
   * UPDATE DOCTOR
   * ============================
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

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

    await CacheService.invalidateByPattern("doctor:list");

    return updated;
  }

  /**
   * ============================
   * DELETE DOCTOR
   * ============================
   */
  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Doctor ID");
    }

    const deleted = await DoctorModel.findByIdAndDelete(id).exec();

    await CacheService.invalidateByPattern("doctor:list");

    return deleted;
  }
}
