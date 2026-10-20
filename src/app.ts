import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { ApiResponse } from "./utils/apiResponse";

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "SkillForge Technologies - Task Management REST API",
    status: "Active",
    documentation: {
      healthCheck: "GET /api/health",
      tasksEndpoint: "GET /api/tasks",
      documentationFile: "README.md",
    },
  });
});

// Main API Router
app.use("/api", apiRoutes);

// Catch 404 - Route not found
app.use((req: Request, res: Response) => {
  ApiResponse.notFound(res, `Cannot ${req.method} ${req.originalUrl}`);
});

// Global Error Handler
app.use(errorHandler);

export default app;
