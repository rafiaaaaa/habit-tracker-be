import { Schema, model, Document, Types } from "mongoose";

export interface IHabitRecord extends Document {
  habit: Types.ObjectId;
  date: Date;
  completed: boolean;
  streak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

const HabitRecordSchema = new Schema<IHabitRecord>(
  {
    habit: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
  { timestamps: true },
);

HabitRecordSchema.index({ habit: 1, date: 1 }, { unique: true });

export default model<IHabitRecord>("HabitRecord", HabitRecordSchema);
