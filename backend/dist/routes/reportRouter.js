import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { teamMemberOnly } from "../middleware/role.middleware.js";
import { createReportController, myReportsController, submitReportControler, update, } from "../controllers/report.controller.js";
import { reportIdParamSchema, reportQuerySchema, updateReportSchema, } from "../validators/report.validator.js";
const reportRouter = express.Router();
reportRouter.use(authenticate);
//Team member
reportRouter.post("/", teamMemberOnly, createReportController);
reportRouter.put("/:id", validate(updateReportSchema), update);
reportRouter.patch("/:id/submit", validate(reportIdParamSchema), submitReportControler);
reportRouter.get("/me", validate(reportQuerySchema), myReportsController);
export default reportRouter;
