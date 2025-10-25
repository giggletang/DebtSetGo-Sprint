import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // Move to .env later ✅

router.post("/register", async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (email, full_name) VALUES (?, ?)",
      [email, fullName]
    );
    const userId = result.insertId;

    await db.execute(
      "INSERT INTO profiles (user_id, state, income_monthly, credit_card_owned) VALUES (?, NULL, 0, FALSE)",
      [userId]
    );

    res.json({ userId, message: "✅ User registered!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Registration failed — email may exist" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (!users.length) return res.status(401).json({ error: "User not found" });

    const user = users[0];
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: user.user_id, message: "✅ Login success!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
