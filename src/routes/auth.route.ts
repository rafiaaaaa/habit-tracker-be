import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);

export default router;
