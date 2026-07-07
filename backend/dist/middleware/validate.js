import { ZodError } from "zod";
import ApiError from "../utils/apiError.js";
export const validate = (schema) => (request, _response, next) => {
    try {
        const parsed = schema.parse({
            body: request.body,
            query: request.query,
            params: request.params,
        });
        if (parsed && typeof parsed === "object") {
            const typedParsed = parsed;
            if ("body" in typedParsed)
                request.body = typedParsed.body ?? request.body;
            if ("query" in typedParsed)
                request.query = (typedParsed.query ?? request.query);
            if ("params" in typedParsed)
                request.params = (typedParsed.params ?? request.params);
        }
        next();
    }
    catch (err) {
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
