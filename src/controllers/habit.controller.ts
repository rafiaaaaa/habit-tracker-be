import { Request, Response } from "express";
import { addHabitService } from "../services/habit.service";
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
