import { Types } from "mongoose";
import { SuperAdminModel } from "../../models/super-admin";

export default class SuperAdminService {
  static async create(payload: Record<string, unknown>) {
    return SuperAdminModel.create(payload);
  }

  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }
    return SuperAdminModel.findById(id);
  }

  static async getAll() {
    return SuperAdminModel.find();
  }

  static async updateById(id: string, payload: { isActive?: boolean }) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }

    const admin = await SuperAdminModel.findById(id);
    if (!admin) return null;

    if (payload.isActive !== undefined) {
      admin.isActive = payload.isActive;
    }

    await admin.save();
    return admin;
  }

  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Super Admin ID");
    }
    return SuperAdminModel.findByIdAndDelete(id);
  }
}
