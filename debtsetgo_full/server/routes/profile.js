import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET /api/profile/:userId  -> 获取个人资料
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const [rows] = await db.execute(
      `SELECT 
         u.full_name AS fullName,
         u.email,
         p.age,
         p.address,
         p.state
       FROM users u
       LEFT JOIN profiles p ON u.user_id = p.user_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = rows[0];
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// PUT /api/profile/:userId -> 更新个人资料
router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, email, age, address, state } = req.body;

    // 更新 users 表中的姓名 & 邮箱
    await db.execute(
      "UPDATE users SET full_name = ?, email = ? WHERE user_id = ?",
      [fullName, email, userId]
    );

    // 更新 profiles 表中的年龄、地址、州；确保有 profile 记录
    const [result] = await db.execute(
      "UPDATE profiles SET age = ?, address = ?, state = ? WHERE user_id = ?",
      [age || null, address || null, state || null, userId]
    );

    // 如果还没有 profile 记录，插一条
    if (result.affectedRows === 0) {
      await db.execute(
        "INSERT INTO profiles (user_id, age, address, state, income_monthly, credit_card_owned) VALUES (?, ?, ?, ?, 0, FALSE)",
        [userId, age || null, address || null, state || null]
      );
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
