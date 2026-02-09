import { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: z.flattenError(error).fieldErrors,
        });
      }
      next(error);
    }
  };
};
