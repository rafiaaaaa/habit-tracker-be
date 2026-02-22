import { Request, Response } from "express";
import {
  createPaymentLinkService,
  paymentWebhook,
  verifySessionService,
} from "../services/payment.service";
import { AppError } from "../utils/AppError";
import { stripe } from "../config/stripe";
import Subscription from "../models/Subscription";

export const createPaymentLinkController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id;
  const paymentLink = await createPaymentLinkService(userId);
  if (!paymentLink) throw new AppError("Payment link not created", 400);
  return res.status(200).json({ success: true, data: paymentLink });
};

export const paymentWebhookController = async (req: Request, res: Response) => {
  console.log("ini body", req.body);
  const body = req.body;
  const data = await paymentWebhook(body);
  return res.status(200).json({ success: true, data });
};

export const verifySessionController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new AppError("Session id is required", 400);
  }

  await verifySessionService(userId, sessionId);

  return res.json({
    success: true,
  });
};
