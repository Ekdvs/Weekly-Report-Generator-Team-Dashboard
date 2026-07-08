import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { getUserById, listUsers, updateUserRole } from "../services/user.service.js";

// get all user contoller
export const listController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const role = request.query.role as Role | undefined;
    const users = await listUsers(role);
    response.status(200).json(
        { 
            success: true, 
            data: users 
        }
    );
  } catch (error) {
    next(error);
  }
};

// get user by user id
export const getOneController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const user = await getUserById(id);
    response.status(200).json(
        { 
            success: true, data: user 
        }
    );
  } catch (error) {
    next(error);
  }
};

//change user role
export const updateRoleController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const user = await updateUserRole(id, request.body.role);
    response.status(200).json(
        {
        success: true,
        message: "User role updated",
        data: user,
        }
    );
  } catch (error) {
    next(error);
  }
};