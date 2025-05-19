import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
); // Enable CORS with credentials
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // Logging middleware

// Routes
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express server!" });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Connect to MongoDB
  connectDB().catch(() => {
    process.exit(1);
  });
});

// Close MongoDB connection when server stops
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

export default app;
