import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authrouter.js";
import {Request, Response} from "express"
import ApiError from "./utils/apiError.js";
import { errorHandler } from "./middleware/eroor.js";
import projectRouter from "./routes/projectRouter.js";
import reportRouter from "./routes/reportRouter.js";
import dashboardRouter from "./routes/dashbordRouter.js";
import aiRouter from "./routes/aiRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(cors(
  {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
     methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]

  }
));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// --- Health check ---
app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ success: true, message: "Server is healthy" });
});

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/reports", reportRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);
app.use("/api/users", userRouter);

// --- 404 handler (no matching route) ---
app.use((_request: Request, _response: Response, next: NextFunction) => {
  next(ApiError.notFound("Route not found"));
});

app.use(errorHandler);

export default app;