import User, { IUser } from "../models/User";
import {
  loginUserRequest,
  registerUserRequest,
} from "../validations/user.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export const registerUserService = async (
  data: registerUserRequest,
): Promise<IUser> => {
  const existsUser = await User.findOne({
    email: data.email,
  });

  if (existsUser) throw new Error("User already exists");
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
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) throw new Error("Invalid password");

  if (user.timezone !== data.timezone) {
    user.timezone = data.timezone;
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
