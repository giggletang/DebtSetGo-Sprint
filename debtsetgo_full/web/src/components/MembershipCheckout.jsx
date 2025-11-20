import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { purchaseMembership } from "../api";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

const PLAN_NAMES = {
  "1_month": "Monthly Plan",
  "3_months": "Quarterly Plan",
  "1_year": "Annual Plan",
  lifetime: "Lifetime Plan",
};

const PLAN_PRICES = {
  "1_month": "$9.99",
  "3_months": "$24.99",
  "1_year": "$79.99",
  lifetime: "$199.99",
};

export default function MembershipCheckout({ userId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const planFromState = location.state?.plan || "3_months";

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || v;
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!userId) {
      setError("You must be logged in to purchase a membership.");
      return;
    }

    if (!cardNumber || !cvv || !name || !address || !expiry) {
      setError("All fields are required. Please fill in all payment information.");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 13) {
      setError("Please enter a valid card number.");
      return;
    }

    if (cvv.length < 3) {
      setError("Please enter a valid CVV.");
      return;
    }

    try {
      setLoading(true);
      const res = await purchaseMembership({
        userId,
        plan: planFromState,
        cardNumber: cardNumber.replace(/\s/g, ""),
        cvv,
        name,
        address,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/app"), 3000);
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
    if (success) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
            <p className="text-lg text-slate-600 mb-6">
              Your {PLAN_NAMES[planFromState]} membership has been activated successfully.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      );
    }

  return (
      <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
    <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Purchase</h1>
        <p className="text-slate-600">Secure payment • Your information is encrypted</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Payment Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Card Number */}
              <div>
<label className="block text-sm font-semibold text-slate-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Name on Card */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, City, State, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing Payment..." : `Pay ${PLAN_PRICES[planFromState]}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600">Plan</span>
                <span className="font-semibold text-slate-900">{PLAN_NAMES[planFromState]}</span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600">Amount</span>
                <span className="text-2xl font-bold text-slate-900">{PLAN_PRICES[planFromState]}</span>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Lock className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Lock className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Your payment information is safe</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Lock className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
