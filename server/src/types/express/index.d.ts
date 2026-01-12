import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      role:
        | "patient"
        | "doctor"
        | "hospital-admin"
        | "hospital"
        | "super-admin";
      hospitalId?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
