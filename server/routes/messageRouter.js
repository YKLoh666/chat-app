import express from "express";
import { getNewestMessage } from "../controller/messageControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/get-newest-message/:chatroomid", authMiddleware, getNewestMessage);

export default router;
