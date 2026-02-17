import { Router } from "express";
import authRoutes from "./auth.route";
import habitRoutes from "./habit.route";
import subscrptionRoutes from "./subscription.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/habits", habitRoutes);
router.use("/subscription", subscrptionRoutes);

export default router;
