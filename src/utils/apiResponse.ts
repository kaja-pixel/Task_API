import { Response } from "express";

export interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
}

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, meta?: any, statusCode = 200) {
    const response: ApiResponseData<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data: T) {
    return this.success(res, message, data, undefined, 201);
  }

  static error(res: Response, message: string, error?: any, statusCode = 500) {
    const response: ApiResponseData<null> = {
      success: false,
      message,
      ...(error !== undefined && { error }),
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, message = "Resource not found") {
    return this.error(res, message, undefined, 404);
  }

  static badRequest(res: Response, message = "Bad request", error?: any) {
    return this.error(res, message, error, 400);
  }
}
