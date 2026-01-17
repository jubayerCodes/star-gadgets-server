import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "../errorHelpers/handleZodError";
import { TErrorSources } from "../interfaces/error.interface";
import handleValidationError from "../errorHelpers/handleValidationError";
import handleCastError from "../errorHelpers/handleCastError";
import handleDuplicateError from "../errorHelpers/handleDuplicateError";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something Went Wrong!";
  let errorSources: TErrorSources | undefined = undefined;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    status: statusCode,
    success: false,
    message,
    errorSources: envVars?.NODE_ENV === "development" ? errorSources : null,
    err: envVars?.NODE_ENV === "development" ? err : null,
    stack: envVars?.NODE_ENV === "development" ? err?.stack : null,
  });
};
