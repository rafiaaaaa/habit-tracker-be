import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  timezone: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timezone: { type: String, required: true, default: "UTC" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", UserSchema);
