import { useState } from "react";
import { recommendInvestments } from "../api";

export default function InvestmentRecommender({ userId }) {
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [riskProfile, setRiskProfile] = useState("Conservative");
  const [horizonYears, setHorizonYears] = useState("3");
  const [needsLiquidity, setNeedsLiquidity] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setError("");
    setResult(null);

    if (!userId) {
      setError("You must be logged in to use the investment recommender.");
      return;
    }

    if (!monthlyAmount || Number(monthlyAmount) <= 0) {
      setError("Please enter a valid monthly amount.");
      return;
    }

    setLoading(true);
    try {
      const data = await recommendInvestments({
        userId,
        monthlyAmount: Number(monthlyAmount),
        riskProfile,
        horizonYears: Number(horizonYears),
        needsLiquidity,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Investment Recommender</h2>
      <p className="section-subtitle">
        Suggests safe, student-friendly investment options based on your budget and risk profile.
      </p>

      <div className="tax-form">
        <label>
          Monthly Amount to Invest
          <input
            type="number"
            placeholder="e.g., 100"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
          />
        </label>

        <label>
          Risk Profile
          <select
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value)}
          >
            <option value="Conservative">Conservative</option>
            <option value="Balanced">Balanced</option>
            <option value="Growth">Growth</option>
          </select>
        </label>

        <label>
          Time Horizon
          <select
            value={horizonYears}
            onChange={(e) => setHorizonYears(e.target.value)}
          >
            <option value="1">&le; 1 year</option>
            <option value="3">1–3 years</option>
            <option value="5">3–5 years</option>
            <option value="7">&ge; 5 years</option>
          </select>
        </label>

        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={needsLiquidity}
            onChange={(e) => setNeedsLiquidity(e.target.checked)}
          />
          I may need this money in the next 1–2 years.
        </label>

        <button
          className="primary-btn"
          disabled={loading}
          onClick={handleRecommend}
        >
          {loading ? "Generating..." : "Get Recommendations"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {result && (
        <div className="tax-result">
          <h3>Suggested Options</h3>

          {result.profile && (
            <p>
              For <strong>{result.profile.fullName}</strong>
              {result.profile.state && <> in <strong>{result.profile.state}</strong></>}
            </p>
          )}

          <p>
            Monthly: <strong>${result.input.monthlyAmount}</strong> ·
            Horizon: <strong>{result.input.horizonYears} years</strong> ·
            Risk: <strong>{result.input.riskProfile}</strong>
          </p>

          <ul className="investment-list">
            {result.suggestions.map((opt) => (
              <li key={opt.id} className="investment-card">
                <h4>{opt.name}</h4>
                <p>{opt.description}</p>
              </li>
            ))}
          </ul>

          <p className="tax-note">
            Estimated total contributions over {result.input.horizonYears} years:
            {" "}
            <strong>${result.summary.totalContributions.toFixed(2)}</strong>
            <br />
            {result.summary.note}
          </p>
        </div>
      )}
    </div>
  );
}
