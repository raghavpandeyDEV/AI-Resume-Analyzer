import mongoose from "mongoose";
import config from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  const conn = await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
}