import { Router } from "express";
import {
  register,
  login,
  getProfile,
  requestRegistrationOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register/otp", requestRegistrationOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/password/otp", requestPasswordResetOtp);
router.post("/password/reset", resetPasswordWithOtp);
router.get("/me", authenticate, getProfile);

export default router;
