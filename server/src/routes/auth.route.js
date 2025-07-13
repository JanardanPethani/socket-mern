import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  checkAuth,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";
import { profilePicUpload } from "../lib/multer.js";

const router = express.Router();

// Register route with file upload error handling
router.post("/register", profilePicUpload, register);

// Login route
router.post("/login", login);

// Logout route (protected)
router.post("/logout", auth, logout);

// Update profile (protected) - handles both profile data and profile picture updates
router.put("/profile", auth, profilePicUpload, updateProfile);

router.get("/check", auth, checkAuth);

// Forgot password and reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
