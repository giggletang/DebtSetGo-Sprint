import express from "express";
import { db } from "../db.js";
const router = express.Router();

// Add Expense
router.post("/expense", async (req, res) => {
  try {
    const { userId, amount, category } = req.body;
    const now = new Date();

    // 1️⃣ Find the current month's budget_id (create one if it doesn't exist)
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

    // 2️⃣ Record this expense
    await db.execute(
      "INSERT INTO transactions (budget_id, category, amount) VALUES (?, ?, ?)",
      [budgetId, category, amount]
    );

    // 3️⃣ Calculate total expenses for current budget (current month)
    const [sumRows] = await db.execute(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE budget_id = ?",
      [budgetId]
    );
    const monthlyTotal = sumRows[0].total;

    // 4️⃣ Simple smart suggestions
    if (category.toLowerCase().includes("grocery") && Number(amount) > 50) {
      await db.execute(
        "INSERT INTO smart_suggestions (budget_id, message) VALUES (?, ?)",
        [budgetId, "Try Student Rewards Card for 3% grocery cashback!"]
      );
    }

    // 5️⃣ Return monthlyTotal to frontend
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
// Get Transactions for a Budget
router.get("/:budgetId/transactions", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT txn_id, category, amount, txn_date FROM transactions WHERE budget_id=? ORDER BY txn_date DESC",
      [req.params.budgetId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;