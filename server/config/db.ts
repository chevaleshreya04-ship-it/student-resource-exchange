import mongoose from "mongoose";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:",getErrorMessage(err));
    process.exit(1);
  }
};

export default connectDB;