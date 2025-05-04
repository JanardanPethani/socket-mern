import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB =>", conn.connection.db.databaseName);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
};

// Create a singleton instance
const database = {
  connect: connectDB,
  disconnect: disconnectDB,
};

export default database;
