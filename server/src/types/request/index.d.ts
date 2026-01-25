import { RequestUser } from "./request-user.types";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
