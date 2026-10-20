import { z } from "zod";

export const TaskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export type TaskStatusType = z.infer<typeof TaskStatusEnum>;
export type TaskPriorityType = z.infer<typeof TaskPriorityEnum>;

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().trim().optional().nullable(),
  status: TaskStatusEnum.default("PENDING").optional(),
  priority: TaskPriorityEnum.default("MEDIUM").optional(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid ISO date-time string (e.g. 2026-12-31T23:59:59Z)" })
    .optional()
    .nullable(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").max(255).optional(),
    description: z.string().trim().optional().nullable(),
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    dueDate: z
      .string()
      .datetime({ message: "Invalid ISO date-time string (e.g. 2026-12-31T23:59:59Z)" })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field (title, description, status, priority, or dueDate) must be provided to update" }
  );

export const getTasksQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority", "title"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20)),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid({ message: "Task ID must be a valid UUID" }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksQueryInput = z.infer<typeof getTasksQuerySchema>;
