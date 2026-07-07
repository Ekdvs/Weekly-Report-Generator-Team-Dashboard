import express from "express"
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import { managerOnly, teamMemberOnly } from "../middleware/role.middleware.js";
import {
  createReportController,
  listAllReportsController,
  myReportsController,
  ReportgetByIdController,
  submitReportControler,
  updateReportController,
} from "../controllers/report.controller.js";
import {
    createReportSchema,
  reportIdParamSchema,
  reportQuerySchema,
  updateReportSchema,
} from "../validators/report.validator.js";


const reportRouter = express.Router();

reportRouter.use(authenticate)

//Team member
reportRouter.post("/",teamMemberOnly ,validate(createReportSchema), createReportController);
reportRouter.put("/:id",teamMemberOnly, validate(updateReportSchema), updateReportController);
reportRouter.patch(
  "/:id/submit",
  teamMemberOnly,
  validate(reportIdParamSchema),
  submitReportControler
);
reportRouter.get("/me", validate(reportQuerySchema), myReportsController);

// Manager
reportRouter.get(
  "/",
  managerOnly,
  validate(reportQuerySchema),
  listAllReportsController
);

// Shared
reportRouter.get("/:id", validate(reportIdParamSchema), ReportgetByIdController);

export default reportRouter