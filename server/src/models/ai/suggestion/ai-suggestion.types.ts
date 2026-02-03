import { Types } from "mongoose";
import {
  SuggestionCategory,
  SuggestionPriority,
  SuggestionTargetRole,
  SuggestionSource,
} from "../../../services/ai/intelligence/suggestion.types";

/**
 * ============================
 * AI SUGGESTION — DB TYPES
 * ============================
 * Read-only persistence layer
 */

export interface AISuggestionBase {
  hospitalId: Types.ObjectId;

  /**
   * Stable business identifier
   */
  code: string;

  /**
   * Who should see this
   */
  targetRole: SuggestionTargetRole;

  /**
   * Classification
   */
  category: SuggestionCategory;
  priority: SuggestionPriority;

  /**
   * Display content
   */
  title: string;
  message: string;

  /**
   * Source (rule / ai / system)
   */
  source: SuggestionSource;

  /**
   * Optional references
   */
  actorId?: Types.ObjectId;

  /**
   * Extra context
   */
  metadata?: Record<string, any>;
}

export interface AISuggestionDocument
  extends AISuggestionBase {
  _id: Types.ObjectId;
  createdAt: Date;
}
