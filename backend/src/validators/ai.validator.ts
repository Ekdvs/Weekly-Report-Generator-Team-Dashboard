import { z } from "zod";

// Conversational Q&A: "What did the design team work on last week?" 
export const aiChatSchema = z.object({
  body: z.object({
    message: z.string().min(1, "message is required").max(1000),
    
    week: z.coerce.date().optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    projectId: z.string().cuid().optional(),
    userId: z.string().cuid().optional(),
  }),
});

// AI-generated team summary for a date range / week. 
export const aiSummarySchema = z.object({
  query: z.object({
    week: z.coerce.date().optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    projectId: z.string().cuid().optional(),
  }),
});

export type AiChatInput = z.infer<typeof aiChatSchema>["body"];
export type AiSummaryInput = z.infer<typeof aiSummarySchema>["query"];