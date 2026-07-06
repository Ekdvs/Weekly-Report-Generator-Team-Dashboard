import { NextFunction, Request, Response } from "express";
import { getCurrentUser, loginuser, registerUser } from "../services/auth.service.js";



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