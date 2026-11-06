import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createUserWithToken = async (username = "tester") => {
  const user = await User.create({ username, password: "hashed-irrelevant" });
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET as string);
  return { user, token };
};