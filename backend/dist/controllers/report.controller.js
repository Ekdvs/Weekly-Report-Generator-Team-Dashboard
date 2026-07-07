import { createReport, getMyReports, getReportForRequester, listAllReports, submitReport, updateReport } from "../services/report.service.js";
// create report controller
export const createReportController = async (req, res, next) => {
    try {
        const report = await createReport(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            message: "Draft report created",
            data: report,
        });
    }
    catch (error) {
        next(error);
    }
};
// update report controller
export const update = async (req, res, next) => {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const report = await updateReport(id, req.user.userId, req.body);
        res.status(200).json({
            success: true,
            message: "Report updated",
            data: report,
        });
    }
    catch (error) {
        next(error);
    }
};
//submit report
export const submitReportControler = async (request, res, next) => {
    try {
        const rawId = request.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const report = await submitReport(id, request.user.userId);
        res.status(200).json({
            success: true,
            message: report.status === "LATE"
                ? "Report submitted (marked as late)"
                : "Report submitted successfully",
            data: report,
        });
    }
    catch (error) {
        next(error);
    }
};
//report get by id
export const ReportgetByIdController = async (request, response, next) => {
    try {
        const rawId = request.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const report = await getReportForRequester(id, request.user.userId, request.user.role);
        response.status(200).json({ success: true, data: report });
    }
    catch (error) {
        next(error);
    }
};
//get my reports
export const myReportsController = async (request, response, next) => {
    try {
        const result = await getMyReports(request.user.userId, request.query);
        response.status(200).json({
            success: true,
            data: result.reports,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
//get all reports
export const listAllReportsController = async (request, response, next) => {
    try {
        const result = await listAllReports(request.query);
        response.status(200).json({
            success: true,
            data: result.reports,
            pagination: result.pagination,
        });
    }
    catch (err) {
        next(err);
    }
};
