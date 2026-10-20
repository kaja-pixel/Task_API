import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
  taskIdParamSchema,
} from "../schemas/task.schema";

const router = Router();

// 1. Create a new task
router.post(
  "/",
  validateBody(createTaskSchema),
  TaskController.createTask
);

// 2. Get all tasks (with filters: status, priority, search, pagination)
router.get(
  "/",
  validateQuery(getTasksQuerySchema),
  TaskController.getAllTasks
);

// 3. Get a single task by ID
router.get(
  "/:id",
  validateParams(taskIdParamSchema),
  TaskController.getTaskById
);

// 4. Update task details and status (supports PUT and PATCH)
router.put(
  "/:id",
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  TaskController.updateTask
);

router.patch(
  "/:id",
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  TaskController.updateTask
);

// 5. Delete a task
router.delete(
  "/:id",
  validateParams(taskIdParamSchema),
  TaskController.deleteTask
);

export default router;
