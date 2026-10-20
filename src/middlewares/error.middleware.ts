import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiResponse } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error for debugging
  console.error("💥 Error handled by error middleware:", err);

  // Handle JSON syntax error
  if (err instanceof SyntaxError && "body" in err) {
    return ApiResponse.badRequest(res, "Malformed JSON payload in request body");
  }

  // Handle Zod Validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return ApiResponse.badRequest(res, "Validation error", formattedErrors);
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        return ApiResponse.notFound(res, "The requested record was not found");
      case "P2002":
        const target = (err.meta?.target as string[]) || ["field"];
        return ApiResponse.badRequest(
          res,
          `A record with this ${target.join(", ")} already exists`
        );
      case "P2003":
        return ApiResponse.badRequest(res, "Foreign key constraint failed");
      default:
        return ApiResponse.badRequest(
          res,
          `Database error: ${err.message}`
        );
    }
  }

  // Handle Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return ApiResponse.badRequest(res, "Invalid database query parameters or payload");
  }

  // Handle Database Connection Errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return ApiResponse.error(
      res,
      "Database connection failed. Please ensure PostgreSQL is running and DATABASE_URL is valid.",
      undefined,
      503
    );
  }

  // Generic fallback
  const isDev = process.env.NODE_ENV === "development";
  return ApiResponse.error(
    res,
    err.message || "Internal server error occurred",
    isDev ? err.stack : undefined,
    err.statusCode || 500
  );
};
