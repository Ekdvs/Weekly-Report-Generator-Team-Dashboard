import express from "express";
import { validate } from "../middleware/validate.js";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema as never), register);
authRouter.post("/login", validate(loginSchema as never), login);
authRouter.get("/me", authenticate, me);
authRouter.post("/logout", logout);

export default authRouter