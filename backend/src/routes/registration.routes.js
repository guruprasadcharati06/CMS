import { Router } from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getRegistrationsForEvent,
  checkInAttendee,
  submitFeedback,
} from "../controllers/registration.controller.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:eventId", authenticate, authorizeRoles("student", "organizer", "admin"), registerForEvent);
router.delete("/:eventId", authenticate, authorizeRoles("student", "organizer", "admin"), cancelRegistration);
router.get("/me/list", authenticate, getMyRegistrations);
router.get("/event/:eventId", authenticate, authorizeRoles("organizer", "admin"), getRegistrationsForEvent);
router.patch("/:registrationId/check-in", authenticate, authorizeRoles("organizer", "admin"), checkInAttendee);
router.post("/:registrationId/feedback", authenticate, authorizeRoles("student", "organizer"), submitFeedback);

export default router;
