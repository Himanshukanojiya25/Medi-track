import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIUsageCounter extends Document {
  scope: 'user' | 'role' | 'hospital';
  scopeId: string;
  window: 'daily' | 'monthly';
  count: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIUsageCounterSchema = new Schema<IAIUsageCounter>(
  {
    scope: { type: String, required: true, index: true },
    scopeId: { type: String, required: true, index: true },
    window: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true },
);

AIUsageCounterSchema.index(
  { scope: 1, scopeId: 1, window: 1 },
  { unique: true },
);

export const AIUsageCounterModel: Model<IAIUsageCounter> =
  mongoose.models.AIUsageCounter ||
  mongoose.model<IAIUsageCounter>('AIUsageCounter', AIUsageCounterSchema);
