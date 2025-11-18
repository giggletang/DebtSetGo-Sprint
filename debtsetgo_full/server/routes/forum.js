import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * GET /api/forum/messages
 * 返回最近的消息列表，按时间正序
 */
router.get("/messages", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
         m.id,
         m.content,
         m.created_at,
         u.user_id,
         u.full_name AS userName
       FROM forum_messages m
       JOIN users u ON m.user_id = u.user_id
       ORDER BY m.created_at ASC
       LIMIT 200`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load forum messages" });
  }
});

/**
 * POST /api/forum/messages
 * body: { userId, content }
 * 插入一条新消息
 */
router.post("/messages", async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content cannot be empty" });
    }

    // 简单限制一下长度，避免太长
    const text = content.trim();
    if (text.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message is too long (max 1000 characters)" });
    }

    const [result] = await db.execute(
      "INSERT INTO forum_messages (user_id, content) VALUES (?, ?)",
      [userId, text]
    );

    // 再查一次，带上用户名返回前端
    const [rows] = await db.execute(
      `SELECT 
         m.id,
         m.content,
         m.created_at,
         u.user_id,
         u.full_name AS userName
       FROM forum_messages m
       JOIN users u ON m.user_id = u.user_id
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
