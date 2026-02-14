import { Request, Response } from "express";
import {
  addHabitService,
  getAllHabitsService,
  toggleTodayHabitService,
} from "../services/habit.service";
import { AppError } from "../utils/AppError";

export const createHabitController = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const habit = await addHabitService(req.body, userId);
  if (!habit) throw new AppError("Habit not created", 400);

  return res.status(200).json({
    success: true,
    data: habit,
  });
};

export const toggleHabitController = async (req: Request, res: Response) => {
  const { habitId } = req.params;
  if (!habitId) throw new AppError("Habit id is required", 400);

  const userId = req.user!.id;
  const status = await toggleTodayHabitService(habitId as string, userId);
  if (!status) throw new AppError("Something went wrong", 400);

  return res.status(200).json({ success: true, data: status });
};

export const getHabitsController = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const habits = await getAllHabitsService(userId);

  return res.status(200).json({ success: true, data: habits });
};
