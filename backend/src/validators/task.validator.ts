import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  userId: z.string().uuid({ message: "Invalid user ID" }).optional(), // Only for admin to create tasks for other users
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .optional(),
  description: z
    .string()
    .max(1000, "Description is too long")
    .nullable()
    .optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const listTasksQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  userId: z.string().uuid({ message: "Invalid user ID" }).optional(), // Only for admin to filter by user
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
