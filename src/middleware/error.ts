import type { Request, NextFunction, Response } from "express";
import type { AppError } from "../utils/error.ts";

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log("error", error);

  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
};
