import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: any) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  };
