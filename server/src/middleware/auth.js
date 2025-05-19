import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Add user to request
    req.user = user;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
