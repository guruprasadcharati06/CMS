import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
  getEvent,
  listEvents,
  featureEvent,
  cancelEvent,
} from "../controllers/event.controller.js";
import { authenticate, authorizeRoles, attachUserIfPresent } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", attachUserIfPresent, listEvents);
router.get("/:eventId", attachUserIfPresent, getEvent);

router.post("/", authenticate, authorizeRoles("organizer", "admin"), createEvent);
router.put("/:eventId", authenticate, authorizeRoles("organizer", "admin"), updateEvent);
router.delete("/:eventId", authenticate, authorizeRoles("organizer", "admin"), deleteEvent);

router.patch("/:eventId/approve", authenticate, authorizeRoles("admin"), approveEvent);
router.patch("/:eventId/reject", authenticate, authorizeRoles("admin"), rejectEvent);
router.patch("/:eventId/feature", authenticate, authorizeRoles("admin"), featureEvent);
router.patch("/:eventId/cancel", authenticate, authorizeRoles("organizer", "admin"), cancelEvent);

export default router;
