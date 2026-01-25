import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidationSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body) as any;
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
