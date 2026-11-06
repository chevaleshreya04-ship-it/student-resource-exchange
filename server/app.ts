import express from "express";
import cors from "cors";
import resourceRoutes from "./routes/resourceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resources", resourceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SRE server is alive.");
});

export default app;