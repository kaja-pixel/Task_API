import prisma from "../config/prisma";
import {
  CreateTaskInput,
  UpdateTaskInput,
  GetTasksQueryInput,
  TaskStatusType,
  TaskPriorityType,
} from "../schemas/task.schema";
import { Prisma } from "@prisma/client";

export class TaskService {
  /**
   * Create a new task
   */
  static async createTask(input: CreateTaskInput) {
    const data: Prisma.TaskCreateInput = {
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    };

    return await prisma.task.create({
      data,
    });
  }

  /**
   * Retrieve all tasks with filtering, search, sorting and pagination
   */
  static async getAllTasks(query: GetTasksQueryInput) {
    const { status, priority, search, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20 } = query;

    const where: Prisma.TaskWhereInput = {};

    if (status) {
      where.status = status as TaskStatusType;
    }

    if (priority) {
      where.priority = priority as TaskPriorityType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieve a single task by its UUID
   */
  static async getTaskById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
    });
  }

  /**
   * Update task details and status
   */
  static async updateTask(id: string, input: UpdateTaskInput) {
    const updateData: Prisma.TaskUpdateInput = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.dueDate !== undefined) {
      updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    return await prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a task by ID
   */
  static async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id },
    });
  }
}
