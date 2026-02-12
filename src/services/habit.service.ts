import Habit, { IHabit } from "../models/Habit";
import { AddHabitRequest } from "../validations/habit.validation";

export async function addHabitService(
  payload: AddHabitRequest,
  userId: string,
): Promise<IHabit> {
  const habit = await Habit.create({
    user: userId,
    title: payload.title,
    description: payload.description,
    frequency: payload.frequency,
    color: payload.color ?? "#facc15",
  });

  return habit;
}
