import express from "express";
import { db } from "../db.js";
const router = express.Router();

// Add Expense
router.post("/expense", async (req, res) => {
  try {
    const { userId, amount, category } = req.body;
    const now = new Date();

    // 1️⃣ 找到本月的 budget_id（没有就创建一条）
    const [budgetRows] = await db.execute(
      "SELECT budget_id FROM budgets WHERE user_id=? AND month=? AND year=?",
      [userId, now.getMonth() + 1, now.getFullYear()]
    );
    let budgetId;
    if (budgetRows.length === 0) {
      const [insert] = await db.execute(
        "INSERT INTO budgets (user_id, month, year) VALUES (?, ?, ?)",
        [userId, now.getMonth() + 1, now.getFullYear()]
      );
      budgetId = insert.insertId;
    } else {
      budgetId = budgetRows[0].budget_id;
    }

    // 2️⃣ 记录本次支出
    await db.execute(
      "INSERT INTO transactions (budget_id, category, amount) VALUES (?, ?, ?)",
      [budgetId, category, amount]
    );

    // 3️⃣ 计算当前 budget（当月）的总支出
    const [sumRows] = await db.execute(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE budget_id = ?",
      [budgetId]
    );
    const monthlyTotal = sumRows[0].total;

    // 4️⃣ 简单智能建议
    if (category.toLowerCase().includes("grocery") && Number(amount) > 50) {
      await db.execute(
        "INSERT INTO smart_suggestions (budget_id, message) VALUES (?, ?)",
        [budgetId, "Try Student Rewards Card for 3% grocery cashback!"]
      );
    }

    // 5️⃣ 把 monthlyTotal 返回给前端
    res.json({ budgetId, monthlyTotal, message: "Expense added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// Get Smart Suggestions
router.get("/:budgetId/suggestions", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM smart_suggestions WHERE budget_id=? ORDER BY created_at DESC",
    [req.params.budgetId]
  );
  res.json(rows);
});

export default router;
