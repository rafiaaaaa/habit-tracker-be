import { Router } from "express";
import authRoutes from "./auth.route";
import habitRoutes from "./habit.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/habits", habitRoutes);

export default router;
