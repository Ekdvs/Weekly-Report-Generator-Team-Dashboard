import { Request, Response, NextFunction, RequestHandler } from "express";
import {  ZodError } from "zod";
import ApiError from "../utils/apiError.js";
import { AnyZodObject } from "zod/v3";

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  (request: Request, _response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: request.body,
        query: request.query,
        params: request.params,
      });

      request.body = parsed.body ?? request.body;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        return next(ApiError.badRequest("Validation failed", details));
      }
      next(err);
    }
  };