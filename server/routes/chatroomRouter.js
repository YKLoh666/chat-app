import express from "express";
import {
  getChatroom,
  getChatrooms,
  getChatroomWithUsername,
} from "../controller/chatroomControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/", authMiddleware, getChatrooms);
router.get("/duo", authMiddleware, getChatroomWithUsername);
router.get("/:chatroomid", authMiddleware, getChatroom);

export default router;
