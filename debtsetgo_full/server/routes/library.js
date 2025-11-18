import express from "express";

const router = express.Router();

/**
 * 简化版教育文章库：
 * 实际项目里可以改成存数据库，这里用静态数组方便课程项目演示。
 */
const GUIDES = [
  {
    id: "budget-basics",
    title: "Budgeting Basics for Students",
    level: "Beginner",
    tags: ["budgeting", "students"],
    summary: "Learn how to track your money, avoid overspending, and build a simple monthly budget.",
    content: `
Budgeting Basics for Students

1. Know your monthly income
   - Part-time job, allowance, scholarships, etc.
   - Write down your average monthly income before you start spending.

2. List your fixed expenses
   - Rent, phone bill, subscriptions (Netflix, Spotify), transportation pass.
   - These are the costs you *must* pay every month.

3. Set limits for flexible expenses
   - Food, coffee, rideshare, eating out, shopping, entertainment.
   - Decide a reasonable weekly budget and stick to it.

4. Pay yourself first
   - Try to save a small amount each month (for example: $20–$50).
   - Put it into savings right after you get paid.

5. Track your spending
   - You can use DebtSetGo Budget Tracker, a spreadsheet, or a notes app.
   - The goal is not perfection — it's awareness.
`
  },
  {
    id: "credit-score",
    title: "Understanding Your Credit Score",
    level: "Beginner",
    tags: ["credit", "score"],
    summary: "What a credit score is, why it matters, and how students can build it safely.",
    content: `
Understanding Your Credit Score

1. What is a credit score?
   - A number (usually 300–850) that tells lenders how risky it is to lend to you.
   - Higher score = easier approvals + better interest rates.

2. Why it matters
   - Impacts credit cards, car loans, student loan refinancing, and even apartment rentals.
   - Good credit can save you a lot of money over time.

3. Key factors
   - Payment history (always pay on time).
   - Credit utilization (try to use less than 30% of your limit).
   - Length of credit history (older accounts help).
   - New credit and hard inquiries.

4. Safe ways to build credit as a student
   - Use a student credit card or secured card.
   - Pay the full balance every month.
   - Avoid maxing out your card.
`
  },
  {
    id: "emergency-fund",
    title: "Building an Emergency Fund",
    level: "Beginner",
    tags: ["saving", "safety"],
    summary: "Why an emergency fund matters and how to slowly build one as a student.",
    content: `
Building an Emergency Fund

1. What is an emergency fund?
   - Money set aside for real emergencies only: medical bills, urgent travel, job loss.
   - Not for shopping, eating out, or normal bills.

2. How much should I aim for?
   - As a student, start small: 100–500 USD.
   - Later, you can grow it to 1–3 months of basic expenses.

3. Where should I keep it?
   - In a high-yield savings account, not in cash or risky investments.
   - The goal is safety + quick access.

4. How to build it slowly
   - Save a small fixed amount every month ($10–$30).
   - Add extra when you get unexpected money (gifts, bonuses, refunds).
`
  },
  {
    id: "investing-vs-saving",
    title: "Saving vs. Investing",
    level: "Intermediate",
    tags: ["saving", "investing"],
    summary: "Understand the difference between saving money safely and investing for growth.",
    content: `
Saving vs. Investing

1. Saving
   - Goal: safety and liquidity (easy access).
   - Where: savings account, high-yield savings, short-term CDs.
   - Good for: emergency fund, near-term goals (next 6–18 months).

2. Investing
   - Goal: growth over a longer period.
   - Where: stocks, ETFs, index funds, retirement accounts.
   - Good for: long-term goals (3+ years).

3. Risk vs. Reward
   - Saving: low risk, low reward.
   - Investing: higher risk, higher potential reward.
   - Time horizon is key: the longer you can wait, the more risk you can usually take.

4. As a student
   - First build a small emergency fund.
   - Then start small with diversified, low-cost investments (for example, broad market ETFs).
`
  }
];

// GET /api/library -> 返回列表（不含大段 content）
router.get("/", (req, res) => {
  const list = GUIDES.map(({ id, title, level, tags, summary }) => ({
    id,
    title,
    level,
    tags,
    summary,
  }));
  res.json(list);
});

// GET /api/library/:id -> 返回单篇内容
router.get("/:id", (req, res) => {
  const guide = GUIDES.find((g) => g.id === req.params.id);
  if (!guide) {
    return res.status(404).json({ error: "Guide not found" });
  }
  res.json(guide);
});

export default router;
