import { Router } from "express";
import taskRoutes from "./task.routes";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Task Management REST API",
    version: "1.0.0",
  });
});

// Task resource routes
router.use("/tasks", taskRoutes);

export default router;
