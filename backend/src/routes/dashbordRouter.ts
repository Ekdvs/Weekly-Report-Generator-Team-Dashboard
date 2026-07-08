import express from "express"
import { authenticate } from "../middleware/auth.js";
import { managerOnly } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.js";
import { dashboardFilterSchema, trendFilterSchema, workloadFilterSchema } from "../validators/dashbord.validator.js";
import { openBlockersController, recentActivityController, submissionStatusController, summaryController, tasksTrendController, workloadByProjectController } from "../controllers/dashbord.controller.js";

const dashboardRouter = express.Router();

// Every dashboard endpoint is manager-only
dashboardRouter.use(authenticate ,managerOnly)

dashboardRouter.get("/summary",validate(dashboardFilterSchema),summaryController)
dashboardRouter.get("/submission-status",validate(dashboardFilterSchema),submissionStatusController)
dashboardRouter.get("/open-blockers",validate(dashboardFilterSchema),openBlockersController)
dashboardRouter.get("/recent-activity",validate(dashboardFilterSchema),recentActivityController)
dashboardRouter.get("/tasks-trend",validate(trendFilterSchema),tasksTrendController)
dashboardRouter.get("/workload-by-project",validate(workloadFilterSchema),workloadByProjectController)



export default dashboardRouter