import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMembershipStatus } from "../api";
import { Check, Crown, Sparkles } from "lucide-react";

const PLANS = [
  { 
    id: "1_month", 
    name: "Monthly", 
    price: "$9.99",
    period: "per month",
    description: "Perfect for trying out premium features",
    features: [
      "All premium tools access",
      "Advanced analytics",
      "Priority support",
      "Cancel anytime"
    ],
    popular: false
  },
  { 
    id: "3_months", 
    name: "Quarterly", 
    price: "$24.99",
    period: "every 3 months",
    originalPrice: "$29.97",
    savings: "Save 17%",
    description: "Best value for short-term planning",
    features: [
      "All premium tools access",
      "Advanced analytics",
      "Priority support",
      "Goal tracking",
      "Export reports"
    ],
    popular: true
  },
  { 
    id: "1_year", 
    name: "Annual", 
    price: "$79.99",
    period: "per year",
    originalPrice: "$119.88",
    savings: "Save 33%",
    description: "Best for long-term financial planning",
    features: [
      "All premium tools access",
      "Advanced analytics",
      "Priority support",
      "Goal tracking",
      "Export reports",
      "AI-powered insights",
      "Custom dashboards"
    ],
    popular: false
  },
  { 
    id: "lifetime", 
    name: "Lifetime", 
    price: "$199.99",
    period: "one-time payment",
    description: "Unlimited access forever",
    features: [
      "All premium tools access",
      "Advanced analytics",
      "Priority support",
      "Goal tracking",
      "Export reports",
      "AI-powered insights",
      "Custom dashboards",
      "Future feature updates",
      "Lifetime support"
    ],
    popular: false
  },
];

export default function MembershipPlans({ userId }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("3_months");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getMembershipStatus(userId)
      .then(setStatus)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleContinue = () => {
    navigate("/membership/checkout", { state: { plan: selected } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Crown className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Plan</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Unlock premium features like advanced analytics, priority support, AI-powered insights, and more.
        </p>
      </div>

      {/* Current Membership Banner */}
      {status && status.isMember && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                You are currently a member
              </p>
              <p className="text-sm text-green-700">
                Plan: <strong>{status.membershipPlan || "Active"}</strong> • You can upgrade or purchase another plan below
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              selected === plan.id
                ? "border-green-500 shadow-xl scale-105"
                : "border-slate-200 hover:border-green-300 hover:shadow-lg"
            } ${plan.popular ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
            onClick={() => setSelected(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selected === plan.id ? "bg-green-100" : "bg-slate-100"
              }`}>
                <Sparkles className={`w-6 h-6 ${
                  selected === plan.id ? "text-green-600" : "text-slate-600"
                }`} />
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-600 ml-1">{plan.period}</span>
              </div>
              {plan.originalPrice && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-slate-400 line-through">{plan.originalPrice}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {plan.savings}
                  </span>
                </div>
              )}
              <p className="text-sm text-slate-600 mt-2">{plan.description}</p>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className={`w-full h-2 rounded-full ${
                selected === plan.id ? "bg-green-500" : "bg-slate-200"
              }`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue to Payment
        </button>
      </div>

      {/* Trust Badge */}
      <div className="text-center pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          🔒 Secure payment • Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
