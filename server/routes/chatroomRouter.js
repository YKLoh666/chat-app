import express from "express";
import { getChatrooms } from "../controller/chatroomControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/", authMiddleware, getChatrooms);

export default router;
