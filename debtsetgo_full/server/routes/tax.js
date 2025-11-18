import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 简化版州税率表（示例）
const STATE_TAX_CONFIG = {
  "California": { rate: 0.06 },
  "Texas":      { rate: 0.00 },
  "New York":   { rate: 0.058 },
  "Georgia":    { rate: 0.05 },
  "Default":    { rate: 0.05 }
};

// 工具函数：根据州名拿税率
function getStateRate(stateName) {
  if (!stateName) return STATE_TAX_CONFIG["Default"].rate;
  const config = STATE_TAX_CONFIG[stateName] || STATE_TAX_CONFIG["Default"];
  return config.rate;
}

// POST /api/tax/estimate
// body: { userId, annualIncome?, filingStatus, withheld }
// 返回：{ state, annualIncome, stateTax, refund, effectiveRate }
router.post("/estimate", async (req, res) => {
  try {
    const { userId, annualIncome, filingStatus, withheld } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 1️⃣ 从 profiles / users 里拿州信息 & 默认收入
    const [rows] = await db.execute(
      `SELECT 
         u.full_name AS fullName,
         p.state,
         p.income_monthly
       FROM users u
       LEFT JOIN profiles p ON u.user_id = p.user_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = rows[0];

    // 年收入：优先用前端传来的 annualIncome，否则用 income_monthly * 12
    const incomeYear =
      annualIncome && annualIncome > 0
        ? Number(annualIncome)
        : profile.income_monthly
        ? Number(profile.income_monthly) * 12
        : 0;

    const stateName = profile.state;
    const rate = getStateRate(stateName);

    const stateTax = incomeYear * rate;

    const withheldNum = withheld ? Number(withheld) : 0;
    const refund = withheldNum - stateTax;
    const effectiveRate = incomeYear > 0 ? stateTax / incomeYear : 0;

    res.json({
      fullName: profile.fullName,
      state: stateName,
      filingStatus: filingStatus || "Single",
      annualIncome: incomeYear,
      stateTax: Number(stateTax.toFixed(2)),
      withheld: Number(withheldNum.toFixed(2)),
      refund: Number(refund.toFixed(2)),        // 正数 = 预计退税；负数 = 预计补税
      effectiveRate: Number((effectiveRate * 100).toFixed(2)) // %
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to estimate state tax" });
  }
});

export default router;
