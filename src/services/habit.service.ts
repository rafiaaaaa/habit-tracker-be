import { PLAN_CONFIG, PlanType } from "../config/plan";
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
  const user = await User.findById(userId).populate("subscription", "plan");
  if (!user) throw new AppError("User not found", 404);

  const userPlan =
    (user.subscription?.plan.toUpperCase() as PlanType) || "FREE";
  const totalHabit = await Habit.countDocuments({ user: userId });

  if (totalHabit >= PLAN_CONFIG[userPlan].habit_limit) {
    throw new AppError("Maximum habit limit reached, upgrade your plan", 409);
  }

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
  type: "mark" | "unmark",
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

  if (type === "unmark") {
    console.log("unmark");
    await unmarkHabit(habit, todayStart);
  } else {
    console.log("mark");
    await markHabit(habit, todayStart);
  }

  const updatedHabit = await Habit.findById(habitId);
  if (!updatedHabit) throw new AppError("Habit not found", 404);

  return await buildHabitResponse(updatedHabit, user.timezone);
}

export const getAllHabitsService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const sevenDaysAgo = DateTime.now()
    .setZone(user.timezone)
    .startOf("day")
    .toUTC()
    .toJSDate();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const habits = await Habit.find({ user: userId });

  const result = await Promise.all(
    habits.map((habit) => buildHabitResponse(habit, user.timezone)),
  );

  return result;
};

export const deleteHabitService = async (habitId: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new AppError("Habit not found for this user", 404);

  await habit.deleteOne();

  return true;
};

const calculateStreak = (habitRecord: any[], timezone: string) => {
  const today = DateTime.now().setZone(timezone).startOf("day");

  let streak = 0;
  let current = today;

  for (const record of habitRecord) {
    const recordDate = DateTime.fromJSDate(record.date)
      .setZone(timezone)
      .startOf("day");

    if (recordDate > current) continue; // guard

    if (recordDate.equals(current)) {
      streak++;
      current = current.minus({ days: 1 });
    } else {
      break;
    }
  }

  return streak;
};

const markHabit = async (habit: IHabit, date: Date) => {
  await HabitRecord.create({
    habit: habit._id,
    date,
  });

  const yesterday = DateTime.fromJSDate(date).minus({ days: 1 }).toJSDate();
  let streak = habit.streak;
  if (habit.lastCompleted === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  await habit.updateOne(
    { _id: habit._id },
    {
      lastCompleted: date,
      streak,
    },
  );
};

const unmarkHabit = async (habit: IHabit, date: Date) => {
  await HabitRecord.findOneAndDelete({
    habit: habit._id,
    date,
  });

  const lastHabitRecord = await HabitRecord.findOne({
    habit: habit._id,
    date: { $lt: date },
  });

  await Habit.updateOne(
    { _id: habit._id },
    {
      lastCompleted: lastHabitRecord?.date ?? null,
      $inc: { streak: -1 },
    },
  );
};

export const buildHabitResponse = async (habit: IHabit, timezone: string) => {
  const today = DateTime.now().setZone(timezone).startOf("day");
  
  const records = await HabitRecord.find({ habit: habit._id })
    .sort({ date: -1 })
    .limit(30);

  const streak = calculateStreak(records, timezone);

  const last7Days = Array.from({ length: 7 }, (_, i) =>
    today.minus({ days: 6 - i }).toFormat("yyyy-MM-dd"),
  );

  const recordMap = new Map(
    records.map((r) => {
      const key = DateTime.fromJSDate(r.date)
        .setZone(timezone)
        .toFormat("yyyy-MM-dd");

      return [key, true];
    }),
  );

  const habitRecords = Object.fromEntries(
    last7Days.map((date) => [date, recordMap.get(date) || false]),
  );

  const todayKey = today.toFormat("yyyy-MM-dd");
  const todayCompleted = habitRecords[todayKey] || false;

  return {
    ...habit.toObject(),
    habitRecords,
    streak,
    todayCompleted,
  };
};
