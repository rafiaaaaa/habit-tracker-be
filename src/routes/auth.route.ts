import { Router } from "express";
import {
  loginGoogleController,
  loginUser,
  logout,
  me,
  registerUser,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, me);

router.post("/google", loginGoogleController);

export default router;
