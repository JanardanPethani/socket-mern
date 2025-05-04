import express from "express";
import {
  register,
  login,
  logout,
  updateProfilePic,
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

// Update profile picture (protected) with file upload error handling
router.put("/profile/picture", auth, profilePicUpload, updateProfilePic);

export default router;
