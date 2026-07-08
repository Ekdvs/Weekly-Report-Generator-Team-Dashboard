import { z } from "zod";

export const listUsersQuerySchema = z.object({
  query: z.object({
    role: z.enum(["TEAM_MEMBER", "MANAGER"]).optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid user id"),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["TEAM_MEMBER", "MANAGER"]),
  }),
  params: z.object({
    id: z.string().cuid("Invalid user id"),
  }),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>["query"];
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>["body"];
