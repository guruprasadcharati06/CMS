import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/:notificationId/read", authenticate, markNotificationRead);
router.patch("/read-all", authenticate, markAllNotificationsRead);
router.delete("/:notificationId", authenticate, deleteNotification);

export default router;
