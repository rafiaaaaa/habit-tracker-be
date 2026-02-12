import { Router } from "express";
import authRoutes from "./auth.route";
import habitRoutes from "./habit.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/habit", habitRoutes);

export default router;
