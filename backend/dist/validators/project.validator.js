import z from "zod";
export const createProjectSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Project name must be at least 2 characters").max(150),
        description: z.string().max(1000).optional(),
    }),
});
export const updateProjectSchema = z.object({
    body: z
        .object({
        name: z.string().min(2).max(150).optional(),
        description: z.string().max(1000).optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
    }),
    params: z.object({
        id: z.string().cuid("Invalid project id"),
    }),
});
export const projectIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("Invalid project id"),
    }),
});
export const assignMemberSchema = z.object({
    body: z.object({
        userId: z.string().cuid("Invalid user id"),
    }),
    params: z.object({
        id: z.string().cuid("Invalid project id"),
    }),
});
export const removeMemberSchema = z.object({
    params: z.object({
        id: z.string().cuid("Invalid project id"),
        userId: z.string().cuid("Invalid user id"),
    }),
});
