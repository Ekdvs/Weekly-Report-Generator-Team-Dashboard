import { Role } from "@prisma/client";
import prisma from "../config/prisma.js";
import ApiError from "../utils/apiError.js";

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

// list all members 
export const listUsers = async (role?: Role) => {
  return prisma.user.findMany({
    where: role ? { role } : undefined,
    select: SAFE_SELECT,
    orderBy: { name: "asc" },
  });
};

//get user by id
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SAFE_SELECT,
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

// manager can change user role
export const updateUserRole = async (id: string, role: Role) => {
  await getUserById(id); // 404 if missing

  return prisma.user.update({
    where: { id },
    data: { role },
    select: SAFE_SELECT,
  });
};
