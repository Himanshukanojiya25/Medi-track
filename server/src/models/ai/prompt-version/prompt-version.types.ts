// src/models/ai/prompt-version/prompt-version.types.ts

import { Types } from "mongoose";

export type PromptScope =
  | "global"
  | "hospital";

export type PromptStatus =
  | "active"
  | "inactive"
  | "archived";

export interface PromptVersionBase {
  name: string;

  scope: PromptScope;

  hospitalId?: Types.ObjectId;

  version: number;

  prompt: string;

  status: PromptStatus;

  description?: string;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export interface PromptVersionDocument extends PromptVersionBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
