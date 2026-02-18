import { Schema, model, Document } from "mongoose";
import { ISubscription } from "./Subscription";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  timezone: string;
  subscription?: ISubscription;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    timezone: { type: String, required: true, default: "UTC" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

UserSchema.virtual("subscription", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

UserSchema.virtual("oAuthUsers", {
  ref: "OAuthUser",
  localField: "_id",
  foreignField: "user",
});

export default model<IUser>("User", UserSchema);
