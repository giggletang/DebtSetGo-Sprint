import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import goals from "./routes/goals.js";
import budget from "./routes/budget.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/goals", goals);
app.use("/api/budget", budget);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
