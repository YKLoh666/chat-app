import express from "express";
import { getMessages } from "../controller/messageControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/:chatroomid", authMiddleware, getMessages);

export default router;
