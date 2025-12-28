import { Request, Response } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
} from "../validators/task.validator";
import {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service";

export const create = async (req: Request, res: Response) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const task = await createTask(validatedData, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    if (error.message === "Target user not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const validatedQuery = listTasksQuerySchema.parse(req.query);

    const tasks = await listTasks(validatedQuery, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await getTaskById(id, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateTaskSchema.parse(req.body);

    const task = await updateTask(id, validatedData, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteTask(id, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
