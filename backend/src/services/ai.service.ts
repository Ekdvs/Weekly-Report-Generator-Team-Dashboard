import { GoogleGenAI } from "@google/genai";
import prisma from "../config/prisma.js";
import { getWeekBounds } from "./dashbord.service.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


const MODEL = "gemini-2.5-flash";

// Hard caps so a wide date range can never blow up the prompt / token budget.
const MAX_REPORTS_IN_CONTEXT = 150;
const MAX_FIELD_LENGTH = 300;

interface ContextFilters {
  week?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  projectId?: string;
  userId?: string;
}

const truncate = (
  text: string | null | undefined,
  max = MAX_FIELD_LENGTH
) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const buildReportContext = async (filters: ContextFilters) => {
  let dateWhere: { gte?: Date; lte?: Date } | undefined;

  if (filters.week) {
    const { weekStart, weekEnd } = getWeekBounds(filters.week);
    dateWhere = { gte: weekStart, lte: weekEnd };
  } else if (filters.dateFrom || filters.dateTo) {
    dateWhere = {
      ...(filters.dateFrom && { gte: filters.dateFrom }),
      ...(filters.dateTo && { lte: filters.dateTo }),
    };
  } else {
    const { weekStart, weekEnd } = getWeekBounds(new Date());
    dateWhere = { gte: weekStart, lte: weekEnd };
  }

  const reports = await prisma.report.findMany({
    where: {
      weekStart: dateWhere,
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.userId && { userId: filters.userId }),
    },
    select: {
      weekStart: true,
      weekEnd: true,
      status: true,
      tasksCompleted: true,
      tasksPlanned: true,
      blockers: true,
      hoursWorked: true,
      submittedAt: true,
      user: {
        select: {
          name: true,
        },
      },
      project: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      weekStart: "desc",
    },
    take: MAX_REPORTS_IN_CONTEXT,
  });

  return reports.map((r) => ({
    member: r.user.name,
    project: r.project.name,
    weekStart: r.weekStart.toISOString().slice(0, 10),
    weekEnd: r.weekEnd.toISOString().slice(0, 10),
    status: r.status,
    hoursWorked: r.hoursWorked,
    tasksCompleted: truncate(r.tasksCompleted),
    tasksPlanned: truncate(r.tasksPlanned),
    blockers: truncate(r.blockers),
  }));
};

const SYSTEM_PROMPT = `
You are an assistant embedded in a manager's weekly-reporting dashboard.

You answer questions strictly using the JSON report data provided.
Never invent tasks, blockers, or names.

If the data doesn't answer the question, say so.

Be concise and factual.

Use bullet points when appropriate.
`;

export const chatWithAssistant = async (
  message: string,
  filters: ContextFilters
) => {
  const context = await buildReportContext(filters);

  if (context.length === 0) {
    return {
      reply:
        "There are no reports matching that scope yet, so I don't have anything to summarize.",
      reportsUsed: 0,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `
${SYSTEM_PROMPT}

Report data (JSON):

${JSON.stringify(context, null, 2)}

Question:

${message}
`,
    });

    return {
      reply: response.text ?? "No response generated.",
      reportsUsed: context.length,
    };
  } catch (error) {
    console.error(error);

    throw new Error("The AI assistant is temporarily unavailable.");
  }
};

const SUMMARY_SYSTEM_PROMPT = `
You are an assistant embedded in a manager's weekly-reporting dashboard.

Given JSON report data, produce a structured summary using EXACTLY these headings:

Completed Work

Recurring Blockers

Workload Balance

Under each heading use short bullet points.

Only use information from the supplied JSON.

If nothing exists for a section, write:

Nothing notable this period.
`;

export const generateTeamSummary = async (
  filters: ContextFilters
) => {
  const context = await buildReportContext(filters);

  if (context.length === 0) {
    return {
      summary: "No reports were found for the selected period.",
      reportsUsed: 0,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `
${SUMMARY_SYSTEM_PROMPT}

Report data (JSON):

${JSON.stringify(context, null, 2)}
`,
    });

    return {
      summary: response.text ?? "No summary generated.",
      reportsUsed: context.length,
    };
  } catch (error) {
    console.error(error);

    throw new Error("The AI assistant is temporarily unavailable.");
  }
};