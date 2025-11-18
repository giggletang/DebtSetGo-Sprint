import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { purchaseMembership } from "../api";

const PLAN_NAMES = {
  "1_month": "1 Month",
  "3_months": "3 Months",
  "1_year": "1 Year",
  lifetime: "Lifetime",
};

export default function MembershipCheckout({ userId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const planFromState = location.state?.plan || "1_month";

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("You must be logged in to purchase a membership.");
      return;
    }

    if (!cardNumber || !cvv || !name || !address) {
      setError("All fields are required. This is just a demo form, but it cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const res = await purchaseMembership({
        userId,
        plan: planFromState,
        cardNumber,
        cvv,
        name,
        address,
      });
      if (res.success) {
        setSuccess("Membership activated successfully!");
        // 2–3 秒后返回首页
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(res.error || "Failed to activate membership.");
      }
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.error || "Failed to activate membership.";
        setError(msg);
    }
        finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Membership Payment</h2>
      <p className="section-subtitle">
        You are purchasing: <strong>{PLAN_NAMES[planFromState]}</strong> membership.
      </p>

      <form className="membership-form" onSubmit={handleSubmit}>
        <label>
          Card Number
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </label>

        <label>
          Security Code (CVV)
          <input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </label>

        <label>
          Name on Card
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Billing Address
          <input
            type="text"
            placeholder="Street, City, State, ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Purchase Membership"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
}
