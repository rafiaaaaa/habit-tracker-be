import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { success } from "zod";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = await registerUserService(payload);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      error = error.message;
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const data = await loginUserService(payload);

    res.cookie("accessToken", data.token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.cookie("refreshToken", data.token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      error = error.message;
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
