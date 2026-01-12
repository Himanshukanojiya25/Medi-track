import { Types } from "mongoose";
import { SuperAdminModel } from "../../models/super-admin";

/**
 * Super Admin Service
 * -------------------
 * Pure business logic layer.
 * No Express, no req/res.
 */
export default class SuperAdminService {
  static async create(payload: Record<string, unknown>) {
    const superAdmin = new SuperAdminModel(payload);
    return superAdmin.save();
  }

  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }

    return SuperAdminModel.findById(id).exec();
  }

  static async getAll() {
    return SuperAdminModel.find().exec();
  }

  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }

    return SuperAdminModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }

    return SuperAdminModel.findByIdAndDelete(id).exec();
  }
}
