import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.DB_URL || "");
    console.log(`MongoDB Connected: ${mongo.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
