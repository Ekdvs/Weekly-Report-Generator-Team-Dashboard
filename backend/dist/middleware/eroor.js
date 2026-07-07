import { ZodError } from "zod";
import ApiError from "../utils/apiError.js";
export const errorHandler = (error, _request, response, _next) => {
    if (error instanceof ApiError) {
        return response.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.details ? { details: error.details } : {}),
        });
    }
    if (error instanceof ZodError) {
        return response.status(400).json({
            success: false,
            message: "Validation failed",
            details: error.issues,
        });
    }
    // log full detail server-side, hide internals from client
    console.error("Unexpected error:", error);
    return response.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
