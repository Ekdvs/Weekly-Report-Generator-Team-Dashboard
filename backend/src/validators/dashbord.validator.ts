import { z } from "zod";


export const dashboardFilterSchema = z.object({
  query: z.object({
    week: z.coerce.date().optional(), 
    projectId: z.string().cuid().optional(),
    userId: z.string().cuid().optional(),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});


export const trendFilterSchema = z.object({
  query: z.object({
    weeks: z.coerce.number().int().positive().max(52).optional().default(8),
    projectId: z.string().cuid().optional(),
    userId: z.string().cuid().optional(),
  }),
});


export const workloadFilterSchema = z.object({
  query: z.object({
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    userId: z.string().cuid().optional(),
  }),
});

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>["query"];
export type TrendFilterInput = z.infer<typeof trendFilterSchema>["query"];
export type WorkloadFilterInput = z.infer<typeof workloadFilterSchema>["query"];
