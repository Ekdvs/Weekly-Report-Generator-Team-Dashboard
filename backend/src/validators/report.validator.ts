import { z } from "zod";

const dateField = z.coerce.date({ message: "Invalid date" });

export const createReportSchema = z.object({
  body: z
    .object({
      weekStart: dateField,
      weekEnd: dateField,
      projectId: z.string().cuid("Invalid project id"),
      tasksCompleted: z.string().min(1, "Tasks completed is required"),
      tasksPlanned: z.string().min(1, "Tasks planned is required"),
      blockers: z.string().max(2000).optional(),
      hoursWorked: z.number().min(0).max(168).optional(),
      notes: z.string().max(2000).optional(),
    })
    .refine((data) => data.weekEnd >= data.weekStart, {
      message: "weekEnd must be the same as or after weekStart",
      path: ["weekEnd"],
    }),
});

export const updateReportSchema = z.object({
  body: z
    .object({
      weekStart: dateField.optional(),
      weekEnd: dateField.optional(),
      projectId: z.string().cuid("Invalid project id").optional(),
      tasksCompleted: z.string().min(1).optional(),
      tasksPlanned: z.string().min(1).optional(),
      blockers: z.string().max(2000).optional(),
      hoursWorked: z.number().min(0).max(168).optional(),
      notes: z.string().max(2000).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
  params: z.object({
    id: z.string().cuid("Invalid report id"),
  }),
});

export const reportIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid report id"),
  }),
});

export const reportQuerySchema = z.object({
  query: z.object({
    projectId: z.string().cuid().optional(),
    userId: z.string().cuid().optional(),
    status: z.enum(["DRAFT", "SUBMITTED", "LATE"]).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>["body"];
export type UpdateReportInput = z.infer<typeof updateReportSchema>["body"];
export type ReportQueryInput = z.infer<typeof reportQuerySchema>["query"];
