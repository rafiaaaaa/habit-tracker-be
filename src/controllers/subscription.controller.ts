import { Request, Response } from "express";
import { createSubscriptionService } from "../services/subscription.service";
import { AppError } from "../utils/AppError";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id;
  const plan = req.body.plan;

  const subscription = await createSubscriptionService(userId, plan);
  if (!subscription) throw new AppError("Subscription not created");

  return res.status(200).json({ success: true, data: subscription });
};
