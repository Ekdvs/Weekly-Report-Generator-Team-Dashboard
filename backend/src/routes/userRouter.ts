import express from "express";
import { authenticate } from "../middleware/auth.js";
import { managerOnly } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.js";
import { listUsersQuerySchema, updateUserRoleSchema, userIdParamSchema } from "../validators/user.validator.js";
import { getOneController, listController, updateRoleController } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.use(authenticate,managerOnly)

userRouter.get("/",validate(listUsersQuerySchema),listController)
userRouter.get("/:id",validate(userIdParamSchema),getOneController)
userRouter.patch("/:id/role",validate(updateUserRoleSchema),updateRoleController)

export default userRouter