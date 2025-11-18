import { useState } from "react";
import { compareWhatIf } from "../api";

export default function WhatIfSimulator({ userId }) {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [years, setYears] = useState("3");
  const [savingsRate, setSavingsRate] = useState(""); // 可选填
  const [investRate, setInvestRate] = useState("");   // 可选填（作为投资最大年化）

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRun = async () => {
    setError("");
    setResult(null);

    if (!userId) {
      setError("You must be logged in to use the What-If Simulator.");
      return;
    }

    if (!monthlyContribution && !initialAmount) {
      setError("Please enter at least an initial amount or a monthly contribution.");
      return;
    }

    // 这两个是“可选填”
    let savingRateValue = null;
    let investRateValue = null;

    if (savingsRate !== "") {
      const v = Number(savingsRate);
      if (Number.isNaN(v) || v < 0) {
        setError("Please enter a valid saving rate (APR %).");
        return;
      }
      savingRateValue = v / 100; // 转成小数
    }

    if (investRate !== "") {
      const v = Number(investRate);
      if (Number.isNaN(v) || v < 0 || v > 20) {
        setError("Please enter a valid investing rate between 0 and 20 (%).");
        return;
      }
      investRateValue = v / 100; // 转成小数
    }

    setLoading(true);
    try {
      const data = await compareWhatIf({
        userId,
        initialAmount: Number(initialAmount || 0),
        monthlyContribution: Number(monthlyContribution || 0),
        years: Number(years),
        savingsRate: savingRateValue, // 可能是 null
        investRate: investRateValue,  // 可能是 null
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to run comparison. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatPct = (x) => `${(x * 100).toFixed(1)}%`;

  return (
    <div>
      <h2>What-If Simulator</h2>
      <p className="section-subtitle">
        Compare &quot;just saving&quot; vs. investing over time. If you leave rates empty, we use 2% for savings and 0–20% for investing.
      </p>

      <div className="tax-form">
        <label>
          Initial Amount (optional)
          <input
            type="number"
            placeholder="e.g., 200"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
          />
        </label>

        <label>
          Monthly Contribution
          <input
            type="number"
            placeholder="e.g., 50"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
          />
        </label>

        <label>
          Time Horizon (years)
          <select
            value={years}
            onChange={(e) => setYears(e.target.value)}
          >
            <option value="1">1 year</option>
            <option value="3">3 years</option>
            <option value="5">5 years</option>
            <option value="10">10 years</option>
          </select>
        </label>

        <label>
          Saving Account Rate (APR, %, optional)
          <input
            type="number"
            step="0.1"
            placeholder="Default: 2%"
            value={savingsRate}
            onChange={(e) => setSavingsRate(e.target.value)}
          />
        </label>

        <label>
          Investing Rate (max APR, %, optional)
          <input
            type="number"
            step="0.1"
            placeholder="Default range: 0% – 20%"
            value={investRate}
            onChange={(e) => setInvestRate(e.target.value)}
          />
        </label>

        <button
          className="primary-btn"
          disabled={loading}
          onClick={handleRun}
        >
          {loading ? "Simulating..." : "Run What-If Comparison"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {result && (
        <div className="tax-result">
          {result.profile && (
            <p>
              Simulation for{" "}
              <strong>{result.profile.fullName || "you"}</strong>
              {result.profile.state && (
                <>
                  {" "}in <strong>{result.profile.state}</strong>
                </>
              )}
              .
            </p>
          )}

          <div className="whatif-grid">
            <div className="whatif-card">
              <h3>Savings Only</h3>
              <p>
                <strong>Rate used:</strong>{" "}
                {formatPct(result.input.savingsRate)}
              </p>
              <p>
                <strong>Final Balance:</strong>{" "}
                ${result.saving.finalBalance.toFixed(2)}
              </p>
              <p>
                <strong>Total Contributed:</strong>{" "}
                ${result.saving.totalContribution.toFixed(2)}
              </p>
            </div>

            <div className="whatif-card">
              <h3>Investing (Range)</h3>
              <p>
                <strong>Rate range:</strong>{" "}
                {formatPct(result.input.investMinRate)} –{" "}
                {formatPct(result.input.investMaxRate)}
              </p>
              <p>
                <strong>Final Balance Range:</strong>{" "}
                ${result.investingMin.finalBalance.toFixed(2)} – $
                {result.investingMax.finalBalance.toFixed(2)}
              </p>
              <p>
                <strong>Total Contributed (same as savings):</strong>{" "}
                ${result.investingMax.totalContribution.toFixed(2)}
              </p>
            </div>
          </div>

          <p className="tax-note">
            Compared to saving only:
            <br />
            • If investing returns {formatPct(result.input.investMinRate)} per year
            (very conservative), you end with{" "}
            <strong>
              ${(result.investingMin.finalBalance - result.saving.finalBalance).toFixed(2)}
            </strong>{" "}
            more (could be negative).
            <br />
            • If investing returns {formatPct(result.input.investMaxRate)} per year,
            you end with{" "}
            <strong>
              ${(result.investingMax.finalBalance - result.saving.finalBalance).toFixed(2)}
            </strong>{" "}
            more than just saving.
          </p>

          <p className="tax-note">
            {result.note}
          </p>
        </div>
      )}
    </div>
  );
}
