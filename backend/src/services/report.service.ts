import prisma from "../config/prisma.js";
import ApiError from "../utils/apiError.js";

/** Grace period after weekEnd before a submission counts as LATE. */
const GRACE_PERIOD_DAYS = 2;

const isLateSubmission = (weekEnd: Date, submittedAt: Date): boolean => {
  const deadline = new Date(weekEnd);
  deadline.setDate(deadline.getDate() + GRACE_PERIOD_DAYS);
  return submittedAt > deadline;
};

const ensureProjectExists = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw ApiError.badRequest("Project does not exist");
  }
};