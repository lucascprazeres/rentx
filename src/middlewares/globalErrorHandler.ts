import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";

function globalErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statuscode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${error.message}`,
  });
}

export { globalErrorHandler };
