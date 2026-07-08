import { NextFunction, Request, Response } from "express";
import { getCurrentUser, loginuser, registerUser } from "../services/auth.service.js";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days


const setSessionCookie = (response: Response, token: string) => {
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
  });
};


// register user
export const register = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const result = await registerUser(request.body);
        response.status(201).json(
            {
                success: true,
                message: "User registered successfully",
                data: result,
            }
        )

    } catch (error) {
        next(error)
    }
}

//login user
export const login = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const result = await loginuser(request.body);
        setSessionCookie(response, result.token);
        response.status(201).json(
            {
                success: true,
                message: "login successfully",
                data: result,
            }
        )

    } catch (error) {
        next(error)
    }
}

//me
export const me = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
     try {
    const userId = (request as any).user?.userId;
    const user = await getCurrentUser(userId);
    response.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
        next(error)
    }
}

export const logout = async (
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};