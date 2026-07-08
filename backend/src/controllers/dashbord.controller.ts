import { Request, Response, NextFunction} from "express";
import { getOpenBlockers, getRecentActivity, getSubmissionStatus, getSummary, getTasksTrend, getWorkloadByProject } from "../services/dashbord.service.js";
import { DashboardFilterInput, TrendFilterInput, WorkloadFilterInput } from "../validators/dashbord.validator.js";

//get summary controller
export const summaryController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await getSummary(
      request.query as unknown as DashboardFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data :result

        }
    );
  } catch (error) {
    next(error);
  }
};

//get submission status
export const submissionStatusController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const result = await getSubmissionStatus(
      request.query as unknown as DashboardFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data :result
        }
    );
  } catch (err) {
    next(err);
  }
};

// open blockers
export const openBlockersController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await getOpenBlockers(
      request.query as unknown as DashboardFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data :result
        }
    );
  } catch (error) {
    next(error);
  }
};

//get recent Activity
export const recentActivityController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const result = await getRecentActivity(
      request.query as unknown as DashboardFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data:result 
        }
    );
  } catch (error) {
    next(error);
  }
};

//tasks trend
export const tasksTrendController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await getTasksTrend(
      request.query as unknown as TrendFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data : result
        }
    );
  } catch (error) {
    next(error);
  }
};

//work load by  project 
export const workloadByProjectController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const result = await getWorkloadByProject(
      request.query as unknown as WorkloadFilterInput
    );
    response.status(200).json(
        { 
            success: true, 
            data : result
        }
    );
  } catch (error) {
    next(error);
  }
};