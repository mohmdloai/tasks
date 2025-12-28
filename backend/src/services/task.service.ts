import prisma from "../config/database";
import { Role, TaskStatus } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from "../validators/task.validator";

export interface TaskUser {
  id: string;
  role: Role;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to build where clause based on role
const buildOwnershipFilter = (user: TaskUser, additionalFilter: object = {}) => {
  if (user.role === Role.ADMIN) {
    return additionalFilter;
  }
  return { ...additionalFilter, userId: user.id };
};

export const createTask = async (
  data: CreateTaskInput,
  user: TaskUser
): Promise<TaskResponse> => {
  // Regular users can only create tasks for themselves
  // Admins can create tasks for any user (if userId provided) or themselves
  const targetUserId = user.role === Role.ADMIN && data.userId ? data.userId : user.id;

  // Verify target user exists if admin is creating for another user
  if (user.role === Role.ADMIN && data.userId && data.userId !== user.id) {
    const targetUser = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!targetUser) {
      throw new Error("Target user not found");
    }
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || TaskStatus.PENDING,
      userId: targetUserId,
    },
  });

  return task;
};

export const listTasks = async (
  query: ListTasksQuery,
  user: TaskUser
): Promise<TaskResponse[]> => {
  const whereClause: any = {};

  // Apply status filter if provided
  if (query.status) {
    whereClause.status = query.status;
  }

  // Role-based filtering
  if (user.role === Role.ADMIN) {
    // Admin can filter by userId if provided, otherwise see all tasks
    if (query.userId) {
      whereClause.userId = query.userId;
    }
  } else {
    // Regular users can only see their own tasks
    whereClause.userId = user.id;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return tasks;
};

export const getTaskById = async (
  taskId: string,
  user: TaskUser
): Promise<TaskResponse> => {
  const whereClause = buildOwnershipFilter(user, { id: taskId });

  const task = await prisma.task.findFirst({
    where: whereClause,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput,
  user: TaskUser
): Promise<TaskResponse> => {
  // First verify the task exists and user has access
  const existingTask = await getTaskById(taskId, user);

  const task = await prisma.task.update({
    where: { id: existingTask.id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });

  return task;
};

export const deleteTask = async (
  taskId: string,
  user: TaskUser
): Promise<void> => {
  // First verify the task exists and user has access
  const existingTask = await getTaskById(taskId, user);

  await prisma.task.delete({
    where: { id: existingTask.id },
  });
};
