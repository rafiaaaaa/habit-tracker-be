import { Schema, model, Document, Types } from "mongoose";

export interface IHabit extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  streak: number;
  longestStreak: number;
  lastCompleted?: Date;
  frequency: "DAILY" | "WEEKLY" | "CUSTOM";
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompleted: { type: Date },
    frequency: {
      type: String,
      enum: ["DAILY", "WEEKLY", "CUSTOM"],
      default: "DAILY",
    },
    color: { type: String },
  },
  { timestamps: true },
);

export default model<IHabit>("Habit", HabitSchema);
