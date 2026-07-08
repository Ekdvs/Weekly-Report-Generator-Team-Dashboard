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
    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (request.cookies?.token) {
      // Browser clients authenticate via the httpOnly session cookie
      token = request.cookies.token;
    }

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
