import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest = (zodSchema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req?.body?.data) {
      req.body = JSON.parse(req.body.data);
    }
    req.body = zodSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
