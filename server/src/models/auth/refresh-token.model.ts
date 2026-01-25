import { model } from "mongoose";
import { RefreshTokenDocument } from "./refresh-token.types";
import { RefreshTokenSchema } from "./refresh-token.schema";

export const RefreshTokenModel = model<RefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
