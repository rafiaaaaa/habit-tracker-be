import { Router } from "express";
import authRoutes from "./auth.route";
import habitRoutes from "./habit.route";
import subscrptionRoutes from "./subscription.route";
import paymentRoutes from "./payment.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/habits", habitRoutes);
router.use("/subscription", subscrptionRoutes);
router.use("/payment", paymentRoutes);

export default router;
