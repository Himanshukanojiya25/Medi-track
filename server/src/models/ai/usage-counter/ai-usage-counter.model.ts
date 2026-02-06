import { model, models } from "mongoose";
import { AIUsageCounter } from "./ai-usage-counter.types";
import { AIUsageCounterSchema } from "./ai-usage-counter.schema";

export const AIUsageCounterModel =
  models.AIUsageCounter ||
  model<AIUsageCounter>("AIUsageCounter", AIUsageCounterSchema);
