import Habit, { IHabit } from "../models/Habit";
import HabitRecord, { IHabitRecord } from "../models/HabitRecord";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { formatLocalDate } from "../utils/date";
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
    category: payload.category,
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

export const getAllHabitsService = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const habits = await Habit.find({ user: userId }).populate({
    path: "habitRecords",
    match: {
      date: {
        $gte: sevenDaysAgo,
      },
    },
    options: { sort: { date: -1 } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    return formatLocalDate(d);
  }).reverse();

  const newHabits = habits.map((habit) => {
    const recordMap = new Map(
      habit.habitRecords?.map((r) => {
        const d = new Date(r.date);
        d.setHours(0, 0, 0, 0);
        return [formatLocalDate(d), true];
      }) || [],
    );

    const record = Object.fromEntries(
      last7Days.map((date) => [date, recordMap.get(date) || false]),
    );

    const todayCompleted = record[formatLocalDate(today)];
    return {
      ...habit.toObject(),
      habitRecords: record,
      todayCompleted,
    };
  });
  return newHabits;
};

export const deleteHabitService = async (habitId: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new AppError("Habit not found for this user", 404);

  await habit.deleteOne();

  return true;
};
