// message.routes.js
import express from "express";
import { getMessages, sendMessage, markMessageAsSeen } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // Get messages for a specific user
router.post("/send/:id", protectRoute, sendMessage); // Send a message to a specific user
router.patch("/seen/:id", protectRoute, markMessageAsSeen); // New route for marking messages as seen

export default router;