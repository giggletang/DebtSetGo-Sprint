import express from "express";
import { db } from "../db.js";
const router = express.Router();


// Create Goal
router.post("/", async (req, res) => {
  try {
    const { userId, name, targetAmount, targetDate } = req.body;

    // ✅ Ensure the user exists before inserting goals
    const [user] = await db.execute("SELECT user_id FROM users WHERE user_id=?", [userId]);
    if (user.length === 0) {
      await db.execute("INSERT INTO users (email, full_name) VALUES (?, ?)", [
        `user${userId}@example.com`,
        `User ${userId}`,
      ]);
    }
    
    const [result] = await db.execute(
      "INSERT INTO goals (user_id, name, target_amount, target_date) VALUES (?, ?, ?, ?)",
      [userId, name, targetAmount, targetDate]
    );
    const goalId = result.insertId;

    // Create 3 default steps
    const steps = [
      ["Open savings account", new Date(Date.now() + 3 * 86400000)],
      ["Automate transfers", new Date(Date.now() + 7 * 86400000)],
      ["Review progress", new Date(Date.now() + 30 * 86400000)]
    ];
    for (const [desc, date] of steps) {
      await db.execute(
        "INSERT INTO goal_steps (goal_id, description, due_date) VALUES (?, ?, ?)",
        [goalId, desc, date]
      );
    }

    res.json({ goalId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

// Fetch Goal & Steps
router.get("/:id", async (req, res) => {
  const [goalRows] = await db.execute("SELECT * FROM goals WHERE goal_id=?", [req.params.id]);
  const [steps] = await db.execute("SELECT * FROM goal_steps WHERE goal_id=?", [req.params.id]);
  const completed = steps.filter(s => s.completed_at != null).length;
  const completion = steps.length ? completed / steps.length : 0;
  res.json({ goal: goalRows[0], steps, completion });
});

export default router;
