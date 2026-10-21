import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/imposter_world";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });

    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("[Database] MongoDB Connection Error:", error);
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error("[Database] MongoDB connection error:", err);
});
