import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { ApiResponse } from "../utils/apiResponse";
import { CreateTaskInput, UpdateTaskInput, GetTasksQueryInput } from "../schemas/task.schema";

export class TaskController {
  /**
   * POST /api/tasks
   * Create a new task
   */
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.body as CreateTaskInput);
      return ApiResponse.created(res, "Task created successfully", task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks
   * Get all tasks with optional filters (status, priority, search) and pagination
   */
  static async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as GetTasksQueryInput;
      const { tasks, meta } = await TaskService.getAllTasks(query);
      return ApiResponse.success(res, "Tasks retrieved successfully", tasks, meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Get single task by ID
   */
  static async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const task = await TaskService.getTaskById(id);

      if (!task) {
        return ApiResponse.notFound(res, `Task with ID '${id}' not found`);
      }

      return ApiResponse.success(res, "Task retrieved successfully", task);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id or PATCH /api/tasks/:id
   * Update task details and status
   */
  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updatedTask = await TaskService.updateTask(id, req.body as UpdateTaskInput);
      return ApiResponse.success(res, "Task updated successfully", updatedTask);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task
   */
  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const deletedTask = await TaskService.deleteTask(id);
      return ApiResponse.success(res, "Task deleted successfully", deletedTask);
    } catch (error) {
      next(error);
    }
  }
}
