import Habit, { IHabit } from "../models/Habit";
import HabitRecord, { IHabitRecord } from "../models/HabitRecord";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { AddHabitRequest } from "../validations/habit.validation";
import { DateTime } from "luxon";

export async function addHabitService(
  payload: AddHabitRequest,
  userId: string,
): Promise<IHabit> {
  const habit = await Habit.create({
    user: userId,
    title: payload.title,
    description: payload.description,
    frequency: payload.frequency,
    streak: 0,
    longestStreak: 0,
    color: payload.color ?? "#facc15",
  });

  return habit;
}

export async function toggleTodayHabitService(
  habitId: string,
  userId: string,
): Promise<String> {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new AppError("Habit not found for this user", 404);

  const todayStart = DateTime.now()
    .setZone(user.timezone)
    .startOf("day")
    .toUTC()
    .toJSDate();

  const deletedHabit = await HabitRecord.findOneAndDelete({
    habit: habit._id,
    date: todayStart,
  });

  if (deletedHabit) {
    return "deleted";
  }

  await HabitRecord.create({
    habit: habitId,
    date: todayStart,
  });

  return "created";
}

export const getAllHabitsService = async (
  userId: string,
): Promise<IHabit[]> => {
  const habits = await Habit.find({ user: userId });
  
  return habits;
};
