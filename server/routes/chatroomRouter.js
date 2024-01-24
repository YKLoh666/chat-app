import express from "express";
import {
  getChatroom,
  getChatrooms,
} from "../controller/chatroomControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/", authMiddleware, getChatrooms);
router.get("/:chatroomid", authMiddleware, getChatroom);

export default router;
