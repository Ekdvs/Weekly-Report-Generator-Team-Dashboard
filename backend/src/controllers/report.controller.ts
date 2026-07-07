import { Request, Response, NextFunction, response } from "express";
import { createReport, getMyReports, getReportForRequester, listAllReports, submitReport, updateReport } from "../services/report.service.js";
import { ReportQueryInput } from "../validators/report.validator.js";

// create report controller
export const createReportController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await createReport((req as any).user!.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Draft report created",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// update report controller
export const updateReportController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const report = await updateReport(
      id,
      (req as any).user!.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Report updated",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

//submit report
export const submitReportControler = async (request: Request, res: Response, next: NextFunction) => {
  try {
    const rawId = request.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const report = await submitReport(id, (request as any).user!.userId);
    res.status(200).json({
      success: true,
      message:
        report.status === "LATE"
          ? "Report submitted (marked as late)"
          : "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

//report get by id
export const ReportgetByIdController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const rawId = request.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const report = await getReportForRequester(
      id,
      request.user!.userId,
      request.user!.role
    );
    response.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

//get my reports
export const myReportsController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await getMyReports(
      request.user!.userId,
      request.query as unknown as ReportQueryInput
    );
    response.status(200).json({
      success: true,
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

//get all reports
export const listAllReportsController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await listAllReports(
      request.query as unknown as ReportQueryInput
    );
    response.status(200).json({
      success: true,
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};
