import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.accessToken;

    if (!token) throw new AppError("Unauthorized: No token", 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (err: any) {
    return next(new AppError("Unauthorized: Invalid token", 401));
  }
}
