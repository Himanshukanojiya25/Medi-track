// src/models/ai/prompt-version/prompt-version.schema.ts

import { Schema } from "mongoose";

export const PromptVersionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    scope: {
      type: String,
      enum: ["global", "hospital"],
      required: true,
      index: true,
    },

   hospitalId: {
  type: Schema.Types.ObjectId,
  ref: "Hospital",
  index: true,
  required: function (this: any) {
    return this.scope === "hospital";
  },
},


    version: {
      type: Number,
      required: true,
      min: 1,
    },

    prompt: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "inactive",
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Constraints
 */

// unique version per prompt name + scope + hospital
PromptVersionSchema.index(
  { name: 1, scope: 1, hospitalId: 1, version: 1 },
  { unique: true }
);

// only ONE active prompt per name + scope + hospital
PromptVersionSchema.index(
  {
    name: 1,
    scope: 1,
    hospitalId: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);
