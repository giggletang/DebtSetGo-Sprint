import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * 简单复利模拟：
 *  初始本金 initial
 *  每月定投 monthly
 *  投资年数 years
 *  年化收益 annualRate（小数，例如 0.05 表示 5%）
 */
function simulateScenario({ initial, monthly, years, annualRate }) {
  const months = years * 12;
  const r = annualRate / 12; // 月利率
  let balance = initial;
  let totalContribution = initial;

  for (let m = 1; m <= months; m++) {
    balance += monthly;
    totalContribution += monthly;
    balance *= 1 + r;
  }

  return {
    finalBalance: Number(balance.toFixed(2)),
    totalContribution: Number(totalContribution.toFixed(2)),
  };
}

// POST /api/whatif/compare
// body: { userId, initialAmount, monthlyContribution, years, savingsRate?, investRate? }
// savingsRate / investRate 为小数（0.02 表示 2%），可选
router.post("/compare", async (req, res) => {
  try {
    const {
      userId,
      initialAmount,
      monthlyContribution,
      years,
      savingsRate,
      investRate,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const init = Number(initialAmount) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const yrs = Number(years) || 3;

    // 存钱利率：如果前端没传或 NaN，则用默认 2%
    const saveRate =
      typeof savingsRate === "number" && !Number.isNaN(savingsRate)
        ? savingsRate
        : 0.02; // 2%

    // 投资利率区间：
    // - 如果前端没传 investRate，则使用 [0%, 20%]
    // - 如果传了 investRate（例如 0.10），则区间为 [0%, investRate]
    let investMinRate = 0.0;
    let investMaxRate = 0.2; // 默认 20%
    if (typeof investRate === "number" && !Number.isNaN(investRate)) {
      investMaxRate = investRate;
      if (investMaxRate < investMinRate) {
        investMaxRate = investMinRate;
      }
    }

    // 读一点用户信息用于显示（可选）
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
      console.warn("Failed to load profile for what-if simulator:", e);
    }

    // 场景 A：全部存入高息储蓄账户
    const savingScenario = simulateScenario({
      initial: init,
      monthly,
      years: yrs,
      annualRate: saveRate,
    });

    // 场景 B：投资的收益区间：最低 0%，最高 investMaxRate
    const investingMinScenario = simulateScenario({
      initial: init,
      monthly,
      years: yrs,
      annualRate: investMinRate,
    });

    const investingMaxScenario = simulateScenario({
      initial: init,
      monthly,
      years: yrs,
      annualRate: investMaxRate,
    });

    res.json({
      profile,
      input: {
        initialAmount: init,
        monthlyContribution: monthly,
        years: yrs,
        savingsRate: saveRate,      // 小数
        investMinRate: investMinRate,
        investMaxRate: investMaxRate,
      },
      saving: savingScenario,
      investingMin: investingMinScenario,
      investingMax: investingMaxScenario,
      note: "This is a simplified comparison for educational purposes only, not real financial advice.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to run what-if comparison" });
  }
});

export default router;
