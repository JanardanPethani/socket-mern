import User from "../models/User.model.js";
import { uploadImage } from "../lib/cloudinary.js";
import { generateToken } from "../lib/jwt.js";
import { bufferToDataURI } from "../lib/multer.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profilePic = req.file;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload profile picture if provided
    let profilePicUrl = null;
    if (profilePic) {
      // Convert buffer to data URI using our helper
      const dataURI = bufferToDataURI(profilePic.mimetype, profilePic.buffer);

      // Apply compression options for profile pictures
      profilePicUrl = await uploadImage(dataURI);
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profilePic: profilePicUrl,
    });

    // Generate JWT token
    generateToken(user._id, res);
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: user.profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    generateToken(user._id, res);

    res.json({
      message: "Login successful",
      user: user.profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Update profile picture
export const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload new profile picture with compression
    const profilePicUrl = await uploadImage(profilePic);

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: profilePicUrl },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profile picture updated successfully",
      user: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Clear the jwt cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};
