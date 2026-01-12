import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes";
import { ENV } from "./config/env";
import { connectDB } from "./config/mongoose";

/**
 * --------------------
 * Create Express App
 * --------------------
 */
const app: Application = express();

/**
 * --------------------
 * Global Middlewares
 * --------------------
 */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/**
 * --------------------
 * Health Check
 * --------------------
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "MediTrack API is running 🚀",
    environment: ENV.NODE_ENV,
  });
});

/**
 * --------------------
 * API Routes (v1)
 * --------------------
 * Base path: /api/v1
 *
 * Examples:
 * /api/v1/ai/chat/start
 * /api/v1/ai/prompts/active
 */
app.use("/api/v1", routes);

/**
 * --------------------
 * 404 Handler
 * --------------------
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * --------------------
 * Global Error Handler
 * --------------------
 */
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("❌ Error:", err);

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

/**
 * --------------------
 * Database Connection
 * --------------------
 */
connectDB();

export default app;
