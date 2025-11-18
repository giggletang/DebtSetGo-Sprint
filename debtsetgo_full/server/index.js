import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import goals from "./routes/goals.js";
import budget from "./routes/budget.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import taxRoutes from "./routes/tax.js";
import investmentRoutes from "./routes/investments.js";
import libraryRoutes from "./routes/library.js";
import creditRoutes from "./routes/credit.js";
import forumRoutes from "./routes/forum.js";
import whatIfRoutes from "./routes/whatif.js";
import membershipRoutes from "./routes/membership.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/goals", goals);
app.use("/api/budget", budget);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/whatif", whatIfRoutes);
app.use("/api/membership", membershipRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
