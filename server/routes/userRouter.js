import express from "express";
import {
  loginUser,
  logout,
  registerUser,
  validateUser,
} from "../controller/userControllers.js";

const router = express.Router();

router.get("/", validateUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
