import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 非真实金融建议，只是项目演示用
const INVESTMENT_OPTIONS = [
  {
    id: 1,
    name: "High-Yield Savings Account",
    riskLevel: "Very Low",
    minHorizonYears: 0,
    suitableForStudents: true,
    description:
      "A savings account with higher interest, great for building an emergency fund and keeping money accessible.",
  },
  {
    id: 2,
    name: "Short-Term CD (Certificate of Deposit)",
    riskLevel: "Low",
    minHorizonYears: 1,
    suitableForStudents: true,
    description:
      "A fixed-term deposit with slightly higher returns. Good if you won't need the money for 1–3 years.",
  },
  {
    id: 3,
    name: "Broad Market ETF",
    riskLevel: "Medium",
    minHorizonYears: 3,
    suitableForStudents: true,
    description:
      "A diversified ETF that tracks the overall stock market. Suitable for long-term investing (3+ years).",
  },
  {
    id: 4,
    name: "Balanced ETF / Fund",
    riskLevel: "Medium",
    minHorizonYears: 3,
    suitableForStudents: true,
    description:
      "A mix of stocks and bonds, designed to balance growth and stability for 3–5+ year horizons.",
  },
  {
    id: 5,
    name: "Robo-Advisor Portfolio",
    riskLevel: "Varies",
    minHorizonYears: 3,
    suitableForStudents: true,
    description:
      "An automated portfolio that adjusts based on your risk profile and timeline. Good for beginners.",
  },
  {
    id: 6,
    name: "Education-Focused Savings / 529-like Plan",
    riskLevel: "Low–Medium",
    minHorizonYears: 3,
    suitableForStudents: true,
    description:
      "A long-term savings plan aimed at education expenses. Good if you plan for tuition or grad school.",
  },
];

// 一个简单规则引擎，根据风险和时间过滤推荐
function filterOptions({ riskProfile, horizonYears, needsLiquidity }) {
  const result = [];

  const pushIf = (predicate, optionId) => {
    const opt = INVESTMENT_OPTIONS.find((o) => o.id === optionId);
    if (!opt) return;
    if (predicate) result.push(opt);
  };

  // 所有人都应该有的：应急金
  pushIf(true, 1); // High-Yield Savings

  if (riskProfile === "Conservative") {
    pushIf(horizonYears >= 1, 2); // CD
    pushIf(horizonYears >= 3 && !needsLiquidity, 6); // 教育储蓄
  } else if (riskProfile === "Balanced") {
    pushIf(horizonYears >= 3, 4); // Balanced fund
    pushIf(horizonYears >= 3, 5); // Robo-advisor
  } else if (riskProfile === "Growth") {
    pushIf(horizonYears >= 3, 3); // Broad market ETF
    pushIf(horizonYears >= 3, 5); // Robo-advisor
  }

  // 去重
  const unique = [];
  const seen = new Set();
  for (const opt of result) {
    if (!seen.has(opt.id)) {
      seen.add(opt.id);
      unique.push(opt);
    }
  }
  return unique;
}

// POST /api/investments/recommend
// body: { userId, monthlyAmount, riskProfile, horizonYears, needsLiquidity }
router.post("/recommend", async (req, res) => {
  try {
    const { userId, monthlyAmount, riskProfile, horizonYears, needsLiquidity } =
      req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 可选：读取用户资料（年龄/州/收入）增强文案
    let profile = null;
    try {
      const [rows] = await db.execute(
        `SELECT u.full_name AS fullName, p.state, p.income_monthly
         FROM users u
         LEFT JOIN profiles p ON u.user_id = p.user_id
         WHERE u.user_id = ?`,
        [userId]
      );
      if (rows.length) profile = rows[0];
    } catch (e) {
      console.warn("Failed to load profile for investment recommender:", e);
    }

    const horizon = Number(horizonYears) || 0;
    const monthly = Number(monthlyAmount) || 0;
    const liquidity = !!needsLiquidity;

    const suggestions = filterOptions({
      riskProfile,
      horizonYears: horizon,
      needsLiquidity: liquidity,
    });

    // 估算一个非常粗略的“未来余额”（仅用于展示，不是理财建议）
    const years = horizon > 0 ? horizon : 3;
    const totalContributions = monthly * 12 * years;

    res.json({
      profile,
      input: {
        monthlyAmount: monthly,
        riskProfile,
        horizonYears: years,
        needsLiquidity: liquidity,
      },
      suggestions,
      summary: {
        totalContributions,
        note:
          "This is a simplified estimate for educational purposes only, not real financial advice.",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate investment suggestions" });
  }
});

export default router;
