import { Request, Response, NextFunction, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { ZodError, type ZodTypeAny } from "zod";
import ApiError from "../utils/apiError.js";

export const validate =
  (schema: ZodTypeAny): RequestHandler =>
  (request: Request, _response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: request.body,
        query: request.query,
        params: request.params,
      });

      if (parsed && typeof parsed === "object") {
        const typedParsed = parsed as Record<string, unknown>;
        if ("body" in typedParsed) request.body = typedParsed.body ?? request.body;
        if ("query" in typedParsed) request.query = (typedParsed.query ?? request.query) as ParsedQs;
        if ("params" in typedParsed) request.params = (typedParsed.params ?? request.params) as ParamsDictionary;
      }

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