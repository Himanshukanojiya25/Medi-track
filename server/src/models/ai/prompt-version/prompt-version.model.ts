// src/models/ai/prompt-version/prompt-version.model.ts

import { model, Model } from "mongoose";
import {
  PromptVersionDocument,
} from "./prompt-version.types";
import { PromptVersionSchema } from "./prompt-version.schema";

export interface PromptVersionModel
  extends Model<PromptVersionDocument> {
  activateVersion(
    id: string,
    updatedBy: string
  ): Promise<PromptVersionDocument | null>;

  archiveVersion(
    id: string,
    updatedBy: string
  ): Promise<PromptVersionDocument | null>;
}

PromptVersionSchema.statics.activateVersion =
  async function (id: string, updatedBy: string) {
    const doc = await this.findById(id);
    if (!doc) return null;

    // deactivate existing active version
    await this.updateMany(
      {
        name: doc.name,
        scope: doc.scope,
        hospitalId: doc.hospitalId,
        status: "active",
      },
      { status: "inactive" }
    );

    doc.status = "active";
    doc.updatedBy = updatedBy;
    return doc.save();
  };

PromptVersionSchema.statics.archiveVersion =
  async function (id: string, updatedBy: string) {
    return this.findByIdAndUpdate(
      id,
      {
        status: "archived",
        updatedBy,
      },
      { new: true }
    );
  };

export const PromptVersion = model<
  PromptVersionDocument,
  PromptVersionModel
>("PromptVersion", PromptVersionSchema);
