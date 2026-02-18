import { Request, Response } from "express";
import {
  getMeService,
  loginGoogleService,
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { success } from "zod";

export const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await registerUserService(payload);

  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await loginUserService(payload);

  res.cookie("accessToken", data.token.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", data.token.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    success: true,
    data,
  });
};

export const me = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await getMeService(userId);
  return res.status(200).json({ success: true, data: user });
};

export const loginGoogleController = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  console.log(idToken);
  const data = await loginGoogleService(idToken);

  res.cookie("accessToken", data.token.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", data.token.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ success: true, data });
};
