import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB()

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resources", resourceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SRE server is alive.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});