import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { HospitalAdminModel } from "../../models/hospital-admin";
import { ENV } from "../../config/env";

export default class HospitalAdminService {
  static async create(payload: Record<string, unknown>) {
    const data = payload as any;

    let passwordHash = data.passwordHash;

    if (!passwordHash && data.password) {
      passwordHash = await bcrypt.hash(
        data.password,
        ENV.BCRYPT_SALT_ROUNDS
      );
    }

    if (!passwordHash) {
      throw new Error("Password is required");
    }

    delete data.password;
    delete data.passwordHash;

    return HospitalAdminModel.create({
      ...data,
      passwordHash,
    });
  }

  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    return HospitalAdminModel.findById(id).exec();
  }

  static async getAll() {
    return HospitalAdminModel.find().exec();
  }

  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    const doc = await HospitalAdminModel.findById(id);
    if (!doc) return null;

    const data = payload as any;

    if (data.password) {
      doc.passwordHash = await bcrypt.hash(
        data.password,
        ENV.BCRYPT_SALT_ROUNDS
      );
      delete data.password;
    }

    Object.assign(doc, data);
    await doc.save();

    return doc;
  }

  static async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital Admin ID");
    }

    return HospitalAdminModel.findByIdAndDelete(id).exec();
  }
}
