import { Request, Response, NextFunction } from "express";

import { ZodSchema } from "zod";

export const validateRequest =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    schema.parse(req.body);

    next();
  };
