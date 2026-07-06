import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authrouter.js";
import {Request, Response} from "express"
import ApiError from "./utils/apiError.js";
import { errorHandler } from "./middleware/eroor.js";

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

// --- Health check ---
app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ success: true, message: "Server is healthy" });
});

// --- 404 handler (no matching route) ---
app.use((_request: Request, _response: Response, next: NextFunction) => {
  next(ApiError.notFound("Route not found"));
});

// --- Routes ---
app.use("/api/auth", authRouter);


app.use(errorHandler);

export default app;