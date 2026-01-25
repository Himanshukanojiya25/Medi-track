import { Types } from 'mongoose';
import { HospitalOnboardingModel } from '../../models/super-admin/hospital-onboarding.model';
import { HospitalOnboardingStatus } from '../../constants/super-admin';
import { HttpError } from '../../utils/response';

export class HospitalOnboardingService {
  static async approve(hospitalId: string, superAdminId: string) {
    const record = await HospitalOnboardingModel.findOne({ hospitalId });

    if (!record) {
      throw new HttpError('Onboarding record not found', 404);
    }

    if (record.status !== HospitalOnboardingStatus.PENDING) {
      throw new HttpError(
        'Hospital cannot be approved from current state',
        400
      );
    }

    record.status = HospitalOnboardingStatus.APPROVED;
    record.approvedBy = new Types.ObjectId(superAdminId);
    record.approvedAt = new Date();

    await record.save();
    return record;
  }

  static async reject(
    hospitalId: string,
    superAdminId: string,
    reason: string
  ) {
    const record = await HospitalOnboardingModel.findOne({ hospitalId });

    if (!record) {
      throw new HttpError('Onboarding record not found', 404);
    }

    if (record.status !== HospitalOnboardingStatus.PENDING) {
      throw new HttpError(
        'Hospital cannot be rejected from current state',
        400
      );
    }

    record.status = HospitalOnboardingStatus.REJECTED;
    record.rejectedBy = new Types.ObjectId(superAdminId);
    record.rejectedAt = new Date();
    record.rejectionReason = reason;

    await record.save();
    return record;
  }

  static async suspend(hospitalId: string, superAdminId: string) {
    const record = await HospitalOnboardingModel.findOne({ hospitalId });

    if (!record) {
      throw new HttpError('Onboarding record not found', 404);
    }

    if (record.status !== HospitalOnboardingStatus.APPROVED) {
      throw new HttpError(
        'Only approved hospitals can be suspended',
        400
      );
    }

    record.status = HospitalOnboardingStatus.SUSPENDED;
    record.suspendedBy = new Types.ObjectId(superAdminId);
    record.suspendedAt = new Date();

    await record.save();
    return record;
  }
}
