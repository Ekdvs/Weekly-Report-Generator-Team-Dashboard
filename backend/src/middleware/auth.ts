import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { verifyToken } from "../utils/jwt.js";


export const authenticate = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw ApiError.unauthorized("No token provided");
    }

    const decoded = verifyToken(token);
    request.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized("Token has expired"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized("Invalid token"));
    }
    next(error);
  }
};
