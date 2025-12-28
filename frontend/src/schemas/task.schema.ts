import { z } from 'zod';

const taskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  status: taskStatusEnum.default('PENDING'),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .nullable()
    .optional(),
  status: taskStatusEnum.optional(),
});

// Input types (what the form accepts)
export type CreateTaskInput = z.input<typeof createTaskSchema>;
// Output types (what zod returns after parsing)
export type CreateTaskFormData = z.output<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
