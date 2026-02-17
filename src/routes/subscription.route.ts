import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createSubscriptionController } from "../controllers/subscription.controller";

const router = Router();

router.post("/", authMiddleware, createSubscriptionController);

export default router;
