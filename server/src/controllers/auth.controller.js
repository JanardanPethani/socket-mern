import User from "../models/User.model.js";
import { uploadImage, deleteImage } from "../lib/cloudinary.js";
import { generateToken } from "../lib/jwt.js";
import { bufferToDataURI } from "../lib/multer.js";
import { sendEmail } from "../lib/resend.js";
import crypto from "crypto";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profilePic = req.file;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Upload profile picture if provided
    let profilePicUrl = null;
    let profilePicPublicId = null;
    if (profilePic) {
      // Convert buffer to data URI using our helper
      const dataURI = bufferToDataURI(profilePic.mimetype, profilePic.buffer);

      // Apply compression options for profile pictures
      const { url, publicId } = await uploadImage(dataURI);
      profilePicUrl = url;
      profilePicPublicId = publicId;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profilePic: profilePicUrl,
      profilePicPublicId,
    });

    // Generate JWT token
    generateToken(user._id, res);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    generateToken(user._id, res);

    res.json({
      success: true,
      message: "Login successful",
      user: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Update user profile (combines profile data and profile picture updates)
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const profilePic = req.file;
    const userId = req.user._id;

    // Create an object with the fields to update
    const updateFields = {};

    // Handle profile data updates (username, email)
    if (username || email) {
      // Check if username or email is already taken by another user
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(username ? [{ username }] : []),
              ...(email ? [{ email }] : []),
            ],
          },
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email is already taken",
        });
      }

      // Add fields to the update object
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Handle profile picture upload
    if (profilePic) {
      // Get the current user to access their existing profile picture
      const oldProfilePicPublicId = currentUser
        ? currentUser.profilePicPublicId
        : null;

      // Convert buffer to data URI using our helper
      const dataURI = bufferToDataURI(profilePic.mimetype, profilePic.buffer);

      // Upload and get the image URL
      const { url, publicId } = await uploadImage(dataURI);

      // Add profile picture URL to update fields
      updateFields.profilePic = url;
      updateFields.profilePicPublicId = publicId;

      try {
        if (oldProfilePicPublicId) {
          await deleteImage(oldProfilePicPublicId);
          console.log(`Deleted old profile picture: ${oldProfilePicPublicId}`);
        }
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError);
      }
    }

    // If no fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating profile",
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

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

// Check if user is authenticated
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user.profile,
    });
  } catch (error) {
    console.error("Error checking auth:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Forgot Password - send reset link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email address",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send email
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const html = `<p>You requested a password reset.</p><p>Click <a href='${resetUrl}'>here</a> to reset your password. This link will expire in 1 hour.</p>`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    res.json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending password reset email",
      error: error.message,
    });
  }
};

// Reset Password - set new password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};
