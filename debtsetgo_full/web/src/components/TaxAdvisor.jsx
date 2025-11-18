import { useState } from "react";
import { estimateStateTax } from "../api";

export default function TaxAdvisor({ userId }) {
  const [annualIncome, setAnnualIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("Single");
  const [withheld, setWithheld] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEstimate = async () => {
    setError("");
    setResult(null);

    if (!userId) {
      setError("You must be logged in to use the tax advisor.");
      return;
    }

    setLoading(true);
    try {
      const data = await estimateStateTax({
        userId,
        annualIncome: annualIncome ? Number(annualIncome) : null,
        filingStatus,
        withheld: withheld ? Number(withheld) : 0,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to estimate state tax. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>State-Wise Tax Advisor</h2>
      <p className="section-subtitle">
        Estimate your state tax and potential refund based on your income and location.
      </p>

      <div className="tax-form">
        <label>
          Annual Income (before tax)
          <input
            type="number"
            placeholder="e.g., 24000"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
          />
        </label>

        <label>
          Filing Status
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="HeadOfHousehold">Head of Household</option>
          </select>
        </label>

        <label>
          Estimated State Tax Withheld (this year)
          <input
            type="number"
            placeholder="e.g., 800"
            value={withheld}
            onChange={(e) => setWithheld(e.target.value)}
          />
        </label>

        <button
          className="primary-btn"
          disabled={loading}
          onClick={handleEstimate}
        >
          {loading ? "Estimating..." : "Estimate State Tax"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {result && (
        <div className="tax-result">
          <h3>Estimate for {result.state || "your state"}</h3>
          <p>
            <strong>Annual Income:</strong> ${result.annualIncome.toFixed(2)}
          </p>
          <p>
            <strong>Estimated State Tax:</strong> $
            {result.stateTax.toFixed(2)} ({result.effectiveRate}%)
          </p>
          <p>
            <strong>Estimated Withheld:</strong> $
            {result.withheld.toFixed(2)}
          </p>
          <p>
            <strong>Estimated Refund / Amount Due:</strong>{" "}
            <span style={{ color: result.refund >= 0 ? "green" : "red" }}>
              ${result.refund.toFixed(2)}
            </span>
          </p>
          <p className="tax-note">
            * Positive value means you may receive a refund. Negative value means you may owe additional tax.
          </p>
        </div>
      )}
    </div>
  );
}
