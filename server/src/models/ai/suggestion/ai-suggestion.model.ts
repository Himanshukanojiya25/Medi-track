import { model, Model } from "mongoose";
import { AISuggestionSchema } from "./ai-suggestion.schema";
import { AISuggestionDocument } from "./ai-suggestion.types";

/**
 * ============================
 * MODEL INTERFACE
 * ============================
 */
export interface AISuggestionModelType
  extends Model<AISuggestionDocument> {}

/**
 * ============================
 * MONGOOSE MODEL
 * ============================
 */
export const AISuggestionModel =
  model<AISuggestionDocument, AISuggestionModelType>(
    "AISuggestion",
    AISuggestionSchema
  );
