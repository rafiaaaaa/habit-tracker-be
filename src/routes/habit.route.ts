import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addHabitValidationSchema } from "../validations/habit.validation";
import { createHabitController } from "../controllers/habit.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(addHabitValidationSchema),
  createHabitController,
);

export default router;
