import express from "express";
import { getChatrooms } from "../controller/chatroomControllers.js";

const router = express.Router();

router.get("/", getChatrooms);

export default router;
