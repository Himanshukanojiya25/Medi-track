import { Types } from "mongoose";
import { AIAuditLogModel } from "../../models/ai/ai-audit-log";

/**
 * Aggregation result shape
 * Stable contract for dashboards & APIs
 */
interface HospitalUsageAggregation {
  role: string;
  total: number;
}

/**
 * AI Usage Aggregation Service (Enterprise Grade)
 * ----------------------------------------------
 * Responsibilities:
 * - Provide aggregated AI usage insights
 * - Read-only analytics (NO writes)
 * - Safe under large datasets
 *
 * Design principles:
 * - Index-friendly queries
 * - Defensive input handling
 * - Predictable output shape
 */
export class AIUsageAggregationService {
  static async getHospitalUsage(
    hospitalId: string
  ): Promise<HospitalUsageAggregation[]> {
    /**
     * Defensive ObjectId validation
     */
    if (!Types.ObjectId.isValid(hospitalId)) {
      return [];
    }

    const hospitalObjectId = new Types.ObjectId(hospitalId);

    /**
     * Aggregation pipeline
     * - $match first (uses index on hospitalId)
     * - $group for counts
     * - $project to normalize output
     */
    return AIAuditLogModel.aggregate<HospitalUsageAggregation>([
      {
        $match: {
          hospitalId: hospitalObjectId,
        },
      },
      {
        $group: {
          _id: "$actorRole",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          total: 1,
        },
      },
      {
        /**
         * Safety cap (defensive)
         */
        $limit: 50,
      },
    ]).allowDiskUse(true);
  }
}
