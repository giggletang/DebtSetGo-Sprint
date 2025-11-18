import { useState } from "react";
import { getCreditCoachingPlan } from "../api";

export default function AICreditCoach({ userId }) {
  const [hasCard, setHasCard] = useState("yes");
  const [paysOnTime, setPaysOnTime] = useState("always");
  const [utilization, setUtilization] = useState("low");
  const [numCards, setNumCards] = useState("one");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!userId) {
      setError("You must be logged in to use the credit coach.");
      return;
    }

    setLoading(true);
    try {
      const data = await getCreditCoachingPlan({
        userId,
        hasCard: hasCard === "yes",
        paysOnTime,
        utilization,
        numCards,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate credit tips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Credit Coach</h2>
      <p className="section-subtitle">
        Get simple, student-friendly tips and reminders to build a strong credit history.
      </p>

      <div className="tax-form">
        <label>
          Do you currently have at least one credit card?
          <select
            value={hasCard}
            onChange={(e) => setHasCard(e.target.value)}
          >
            <option value="yes">Yes, I have a credit card</option>
            <option value="no">No, I do not have a card yet</option>
          </select>
        </label>

        <label>
          How often do you pay on time?
          <select
            value={paysOnTime}
            onChange={(e) => setPaysOnTime(e.target.value)}
          >
            <option value="always">Almost always on time</option>
            <option value="sometimes">Sometimes late</option>
            <option value="rarely">Often late</option>
          </select>
        </label>

        <label>
          How much of your total credit limit do you usually use?
          <select
            value={utilization}
            onChange={(e) => setUtilization(e.target.value)}
          >
            <option value="low">Less than 30%</option>
            <option value="medium">Around 30–80%</option>
            <option value="high">More than 80% or close to the limit</option>
            <option value="unknown">I’m not sure</option>
          </select>
        </label>

        <label>
          How many credit cards do you have?
          <select
            value={numCards}
            onChange={(e) => setNumCards(e.target.value)}
          >
            <option value="none">0 cards</option>
            <option value="one">1 card</option>
            <option value="few">2–3 cards</option>
            <option value="many">4+ cards</option>
          </select>
        </label>

        <button
          className="primary-btn"
          disabled={loading}
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Get Credit Tips"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {result && (
        <div className="tax-result">
          {result.profile && (
            <p>
              Credit tips for{" "}
              <strong>{result.profile.fullName || "you"}</strong>
              {result.profile.state && (
                <>
                  {" "}
                  in <strong>{result.profile.state}</strong>
                </>
              )}
              .
            </p>
          )}

          <h3>Recommended Tips</h3>
          <ul className="credit-tip-list">
            {result.tips.map((tip, idx) => (
              <li key={idx} className="credit-tip-item">
                {tip}
              </li>
            ))}
          </ul>

          {result.reminders && result.reminders.length > 0 && (
            <>
              <h3>Suggested Reminders</h3>
              <ul className="credit-reminder-list">
                {result.reminders.map((r, idx) => (
                  <li key={idx} className="credit-reminder-item">
                    <div className="reminder-text">{r.text}</div>
                    <div className="reminder-meta">
                      Frequency: <strong>{r.suggestedFrequency}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="tax-note">
            These tips are for educational purposes only and are not formal financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
