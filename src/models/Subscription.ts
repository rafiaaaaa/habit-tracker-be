import { Document, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
  user: Types.ObjectId;
  plan: string;
  status: string;
  startDate: Date;
  endDate?: Date;
}

export const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "pro"], required: true },
    status: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  },
);
