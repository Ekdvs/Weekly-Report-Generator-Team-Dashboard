import prisma from "../config/prisma.js";
import ApiError from "../utils/apiError.js";
import { signToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
//register user
export const registerUser = async (input) => {
    //user all ready existing check
    const existing = await prisma.user.findUnique({
        where: { email: input.email }
    });
    if (existing) {
        throw ApiError.conflict("A user with this email already exists");
    }
    const hashed = await hashPassword(input.password);
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashed,
            role: input.role,
        }
    });
    return user;
};
//login user
export const loginuser = async (input) => {
    //chek user exist in data base
    const user = await prisma.user.findUnique({
        where: { email: input.email }
    });
    if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
    }
    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
        throw ApiError.unauthorized("Invalid email or password");
    }
    const token = signToken({ userId: user.id, role: user.role });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
//get loging user data
export const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    return user;
};
