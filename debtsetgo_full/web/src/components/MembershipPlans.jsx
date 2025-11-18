import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMembershipStatus } from "../api";

const PLANS = [
  { id: "1_month", name: "1 Month", description: "Short-term access for trying all premium tools." },
  { id: "3_months", name: "3 Months", description: "Save more with a 3-month membership." },
  { id: "1_year", name: "1 Year", description: "Best for students planning ahead for a full year." },
  { id: "lifetime", name: "Lifetime", description: "One-time payment for permanent access." },
];

export default function MembershipPlans({ userId }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("1_month");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getMembershipStatus(userId)
      .then(setStatus)
      .catch((e) => console.error(e));
  }, [userId]);

  const handleContinue = () => {
    navigate("/membership/checkout", { state: { plan: selected } });
  };

  return (
    <div>
      <h2>Membership</h2>
      <p className="section-subtitle">
        Unlock premium features like advanced analytics, priority reminders, and more.
      </p>

      {status && status.isMember && (
        <div className="membership-banner">
          You are currently a member (
          <strong>{status.membershipPlan || "active"}</strong>).
          You can still purchase another plan if you want to upgrade.
        </div>
      )}

      <div className="membership-grid">
        {PLANS.map((plan) => (
          <label
            key={plan.id}
            className={
              "membership-card" +
              (selected === plan.id ? " membership-card-selected" : "")
            }
          >
            <input
              type="radio"
              name="membership"
              value={plan.id}
              checked={selected === plan.id}
              onChange={() => setSelected(plan.id)}
            />
            <div className="membership-card-body">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
          </label>
        ))}
      </div>

      <button className="primary-btn" onClick={handleContinue}>
        Continue to Payment
      </button>
    </div>
  );
}
