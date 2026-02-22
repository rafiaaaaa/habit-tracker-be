import { Router } from "express";
import {
  createPaymentLinkController,
  paymentWebhookController,
  verifySessionController,
} from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPaymentLinkController);
router.post("/verify/session", authMiddleware, verifySessionController);
router.post("/webhook", paymentWebhookController);

export default router;
