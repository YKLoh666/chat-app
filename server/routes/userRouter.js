import express from "express";
import { registerUser } from "../controller/userControllers.js";

const router = express.Router();

router.post("/", registerUser);

export default router;
