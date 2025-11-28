import { Router } from "express";
import { recommendVenue } from "../controllers/intelligence.controller.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/venue", authenticate, authorizeRoles("organizer", "admin"), recommendVenue);

export default router;
