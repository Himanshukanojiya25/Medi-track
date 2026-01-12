import { JwtPayload } from "../auth";

declare global {
  namespace Express {
    /**
     * Authenticated user injected by requireAuth
     */
    interface User {
      id: string;
      role: string;
      hospitalId?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
