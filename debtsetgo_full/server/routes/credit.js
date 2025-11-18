import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * 简单的规则引擎，根据用户自报的习惯 + 后端 profile 信息
 * 生成信用提升建议和提醒方案
 */

// 生成建议 & 提醒
function buildCreditPlan({ hasCard, paysOnTime, utilization, numCards }) {
  const tips = [];
  const reminders = [];

  // 所有人通用的基础建议
  tips.push(
    "Always pay at least the minimum payment before the due date.",
    "Try to pay your full statement balance whenever possible."
  );

  // 没有信用卡 -> 重点是如何安全建立信用
  if (!hasCard) {
    tips.push(
      "You do not have a credit card yet. Consider starting with a student or secured card.",
      "Use your first card for small recurring bills (e.g., subscriptions) and pay them off each month."
    );
    reminders.push({
      type: "starter",
      text: "If you open your first card, set a monthly reminder to pay the full balance.",
      suggestedFrequency: "Monthly"
    });
  }

  // 有卡但偶尔/经常迟还
  if (hasCard && paysOnTime === "sometimes") {
    tips.push(
      "Sometimes you miss or delay payments. Late payments can seriously hurt your credit score.",
      "Set up automatic payments for at least the minimum amount to avoid late fees."
    );
    reminders.push({
      type: "due-date",
      text: "Add a reminder 3–5 days before your credit card due date.",
      suggestedFrequency: "Monthly before each due date"
    });
  }

  if (hasCard && paysOnTime === "rarely") {
    tips.push(
      "You often pay late. This is one of the biggest negative factors for your credit score.",
      "Focus on paying on time for the next 6 months. Even small, consistent on-time payments help a lot."
    );
    reminders.push({
      type: "urgent",
      text: "Create a weekly reminder to check your balances and upcoming due dates.",
      suggestedFrequency: "Weekly"
    });
  }

  // 利用率（用额度的多少）
  if (utilization === "high") {
    tips.push(
      "Your credit utilization seems high. Aim to use less than 30% of your total limit.",
      "If possible, make extra payments before the statement date to temporarily lower utilization."
    );
    reminders.push({
      type: "mid-cycle",
      text: "Set a mid-cycle reminder to make an extra payment if your balance is high.",
      suggestedFrequency: "Once per billing cycle"
    });
  } else if (utilization === "medium") {
    tips.push(
      "Your utilization is moderate. Try to keep it under 30% and avoid running balances close to your limit."
    );
  } else if (utilization === "low") {
    tips.push(
      "Your utilization is low. This is great for your credit score — keep balances small and manageable."
    );
  }

  // 多卡情况：避免频繁开新卡
  if (numCards === "many") {
    tips.push(
      "You already have several cards. Avoid opening too many new accounts in a short time.",
      "Consider closing only unused cards with no annual fee very carefully, as it may affect your credit age."
    );
  } else if (numCards === "one") {
    tips.push(
      "You have a single card. This is a good start — focus on perfect payment history and low utilization."
    );
  }

  return { tips, reminders };
}

// POST /api/credit/coach
// body: { userId, hasCard, paysOnTime, utilization, numCards }
router.post("/coach", async (req, res) => {
  try {
    const { userId, hasCard, paysOnTime, utilization, numCards } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 尝试拿一点用户背景信息（名字、州），用于前端展示
    let profile = null;
    try {
      const [rows] = await db.execute(
        `SELECT u.full_name AS fullName, p.state
         FROM users u
         LEFT JOIN profiles p ON u.user_id = p.user_id
         WHERE u.user_id = ?`,
        [userId]
      );
      if (rows.length) {
        profile = rows[0];
      }
    } catch (e) {
      console.warn("Failed to load profile for credit coach:", e);
    }

    const plan = buildCreditPlan({
      hasCard: !!hasCard,
      paysOnTime,
      utilization,
      numCards
    });

    res.json({
      profile,
      input: {
        hasCard,
        paysOnTime,
        utilization,
        numCards
      },
      tips: plan.tips,
      reminders: plan.reminders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate credit coaching plan" });
  }
});

export default router;
