import mongoose, { Types } from 'mongoose';

/**
 * IMPORTANT:
 * We intentionally fetch the model from mongoose.models
 * because AIAuditLogModel is exported as a TYPE, not a VALUE.
 */
const AIAuditLogModel = mongoose.models.AIAuditLog;

interface HospitalUsageAggregation {
  role: string;
  total: number;
}

export class AIUsageAggregationService {
  static async getHospitalUsage(
    hospitalId: string,
  ): Promise<HospitalUsageAggregation[]> {
    const hospitalObjectId = new Types.ObjectId(hospitalId);

    const result = await AIAuditLogModel.aggregate<HospitalUsageAggregation>([
      {
        $match: {
          hospitalId: hospitalObjectId,
        },
      },
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: '$_id',
          total: 1,
        },
      },
    ]);

    return result;
  }
}
