import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // TODO: move to .env

// 注册：保存加密后的密码
router.post("/register", async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ error: "Email, fullName and password are required" });
    }

    // 1️⃣ 先检查邮箱是否已存在
    const [exist] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (exist.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // 2️⃣ 对密码做哈希（加密）
    const hashed = await bcrypt.hash(password, 10);

    // 3️⃣ 插入用户，连同 password_hash 一起写入
    const [result] = await db.execute(
      "INSERT INTO users (email, full_name, password_hash) VALUES (?, ?, ?)",
      [email, fullName, hashed]
    );
    const userId = result.insertId;

    // 4️⃣ 顺便创建 profile（你之前就有的逻辑）
    await db.execute(
      "INSERT INTO profiles (user_id, state, income_monthly, credit_card_owned) VALUES (?, NULL, 0, FALSE)",
      [userId]
    );

    res.json({ userId, fullName, message: "✅ User registered!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Registration failed" });
  }
});

// 登录：验证邮箱 + 密码
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // 前端传来的 email / phone + password

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1️⃣ 先按 email 查用户
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      // 邮箱都查不到
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // 2️⃣ 数据库里没有密码哈希（旧用户）→ 不允许登录
    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3️⃣ 用 bcrypt 比较密码
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      // 密码错误
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4️⃣ 生成 token（你现在前端其实没用到，但保留）
    const token = jwt.sign(
      { userId: user.user_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ 返回 userId + fullName（前端顶栏会用 fullName）
    res.json({
      token,
      userId: user.user_id,
      fullName: user.full_name,
      message: "✅ Login success!"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
