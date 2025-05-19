import User from "../models/User.model.js";
import { uploadImage, deleteImage } from "../lib/cloudinary.js";
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
          message: "Username or email is already taken",
        });
      }

      // Add fields to the update object
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
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
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Profile updated successfully",
      user: user.profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({
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

    res.json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

// Check if user is authenticated
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.profile);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
