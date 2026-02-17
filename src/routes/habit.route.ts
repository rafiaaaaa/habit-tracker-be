import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addHabitValidationSchema } from "../validations/habit.validation";
import {
  createHabitController,
  deleteHabitController,
  getHabitsController,
  toggleHabitController,
} from "../controllers/habit.controller";

const router = Router();

router.get("/", authMiddleware, getHabitsController);
router.post(
  "/",
  authMiddleware,
  validate(addHabitValidationSchema),
  createHabitController,
);
router.put("/:habitId", authMiddleware, toggleHabitController);
router.delete("/:habitId", authMiddleware, deleteHabitController);

export default router;
