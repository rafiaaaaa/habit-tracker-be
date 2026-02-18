import { model, Schema, Types } from "mongoose";

export interface IOAuthUser {
  user: Types.ObjectId;
  providerId: string;
  provider: string;
}

const OAuthUserSchema = new Schema<IOAuthUser>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: String, required: true },
    provider: {
      type: String,
      required: true,
      enum: ["GOOGLE", "CREDENTIALS"],
      default: "CREDENTIALS",
    },
  },
  { timestamps: true },
);

export const OAuthUser = model<IOAuthUser>(
  "OAuthUser",
  OAuthUserSchema,
  "o_auth_users",
);
