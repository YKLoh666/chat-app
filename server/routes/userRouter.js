import express from "express";
import {
  loginUser,
  logout,
  registerUser,
  validateUser,
  updateStatus,
  searchUsers,
  forgotPassword,
} from "../controller/userControllers.js";
import { authMiddleware } from "../utilities.js";

const router = express.Router();

router.get("/search", authMiddleware, searchUsers);
router.get("/validate", validateUser);
router.post("/register", registerUser);
router.post("/forgotpassword", forgotPassword);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout, updateStatus);
router.put("/:username", authMiddleware, updateStatus);

export default router;
