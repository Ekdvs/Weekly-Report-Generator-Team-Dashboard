import express from "express";
import { authenticate } from "../middleware/auth.js";
import { managerOnly } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.js";
import { aiChatSchema, aiSummarySchema } from "../validators/ai.validator.js";
import { chatController, teamSummaryController } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.use(authenticate, managerOnly);

aiRouter.post("/chat", validate(aiChatSchema), chatController);
aiRouter.get("/team-summary", validate(aiSummarySchema), teamSummaryController);

export default aiRouter;