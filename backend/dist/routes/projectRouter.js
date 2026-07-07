import express from "express";
import { authenticate } from "../middleware/auth.js";
import { anyRole, managerOnly } from "../middleware/role.middleware.js";
import { assignMemberController, createProjectController, deleteProjectByIdController, getProjectByIdController, listMembersController, listProjectController, removeMemberController, updateProjectByIdController } from "../controllers/project.controller.js";
import { validate } from "../middleware/validate.js";
import { assignMemberSchema, createProjectSchema, projectIdParamSchema, removeMemberSchema, updateProjectSchema } from "../validators/project.validator.js";
const projectRouter = express.Router();
projectRouter.use(authenticate);
// Reads — any authenticated team member or manager
projectRouter.get('/', anyRole, listProjectController);
projectRouter.get('/:id', anyRole, getProjectByIdController);
projectRouter.get("/:id/members", anyRole, listMembersController);
// Writes — manager only
projectRouter.post("/", managerOnly, validate(createProjectSchema), createProjectController);
projectRouter.put("/:id", managerOnly, validate(updateProjectSchema), updateProjectByIdController);
projectRouter.delete("/:id", managerOnly, validate(projectIdParamSchema), deleteProjectByIdController);
projectRouter.post("/:id/members", managerOnly, validate(assignMemberSchema), assignMemberController);
projectRouter.delete("/:id/members/:userId", managerOnly, validate(removeMemberSchema), removeMemberController);
export default projectRouter;
