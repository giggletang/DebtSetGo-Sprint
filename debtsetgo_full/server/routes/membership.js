import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * 获取当前用户会员状态
 * GET /api/membership/status/:userId
 */
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.execute(
      "SELECT is_member, membership_plan FROM users WHERE user_id = ?",
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      isMember: rows[0].is_member == 1,
      membershipPlan: rows[0].membership_plan || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get membership status" });
  }
});

/**
 * 购买会员
 * POST /api/membership/purchase
 * body: { userId, plan, cardNumber, cvv, name, address }
 * 这里只做非空检查，任何内容都视为成功购买
 */
router.post("/purchase", async (req, res) => {
  try {
    const { userId, plan, cardNumber, cvv, name, address } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!plan) return res.status(400).json({ error: "plan is required" });

    if (!cardNumber || !cvv || !name || !address) {
      return res
        .status(400)
        .json({ error: "All payment fields must be filled." });
    }

    // 这里只是展示，不做真实支付验证，直接写入会员状态
    await db.execute(
      "UPDATE users SET is_member = 1, membership_plan = ? WHERE user_id = ?",
      [plan, userId]
    );

    res.json({
      success: true,
      message: "Membership activated successfully.",
      plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process membership purchase" });
  }
});

export default router;
