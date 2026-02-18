import { OAuth2Client } from "google-auth-library";
import Subscription from "../models/Subscription";
import User, { IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import {
  loginUserRequest,
  registerUserRequest,
} from "../validations/user.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuthUser } from "../models/OAuthUser";

const JWT_SECRET = process.env.JWT_SECRET!;
export const registerUserService = async (
  data: registerUserRequest,
): Promise<IUser> => {
  const existsUser = await User.findOne({
    email: data.email,
  });

  if (existsUser) throw new AppError("User already exists", 409);
  const password = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password,
    timezone: data.timezone,
  });
  return user;
};

export const loginUserService = async (
  data: loginUserRequest,
): Promise<{
  user: Partial<IUser>;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}> => {
  const user = await User.findOne({
    email: data.email,
  });
  if (!user || !user.password) throw new AppError("User not found", 404);

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid password", 401);

  if (user.timezone !== data.timezone) {
    user.timezone = data.timezone ?? "UTC";
    await user.save();
  }

  const payload = {
    userId: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  const { password, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    token: {
      accessToken,
      refreshToken,
    },
  };
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find();
};

export const getMeService = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)
    .select({
      name: 1,
      email: 1,
      timezone: 1,
    })
    .populate("subscription", "plan endDate -user -_id");

  if (!user) throw new AppError("User not found", 404);

  const today = new Date();
  if (
    user.subscription &&
    user.subscription.plan !== "free" &&
    user.subscription.endDate &&
    user.subscription.endDate < today
  ) {
    await Subscription.updateOne(
      { user: userId },
      { plan: "free", status: "expired" },
    );
    user.subscription.plan = "free";
  }

  if (!user.subscription) {
    await Subscription.create({
      user: userId,
      plan: "free",
      status: "active",
      startDate: new Date(),
    });

    await user.populate({
      path: "subscription",
      select: "plan endDate -user -_id",
    });
  }

  return user;
};

export const loginGoogleService = async (idToken: string) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AppError("Invalid Google token", 401);
  }

  console.log("ini payload", payload);

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      $setOnInsert: {
        email: payload.email,
        name: payload.name,
      },
    },
    { new: true, upsert: true },
  );

  console.log("ini user", user);

  const oAuthUser = await OAuthUser.findOneAndUpdate(
    {
      provider: "GOOGLE",
      providerId: payload.sub,
    },
    {
      $setOnInsert: {
        provider: "GOOGLE",
        providerId: payload.sub,
        user: user._id,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  console.log("ini oAuthUser", oAuthUser);

  const jwtPayload = {
    userId: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: "7d",
  });

  const { password, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    token: {
      accessToken,
      refreshToken,
    },
  };
};
