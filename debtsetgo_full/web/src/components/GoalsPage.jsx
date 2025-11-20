import { useState } from "react";
import { createGoal, getGoal } from "../api";

export default function GoalsPage({ userId }) {
  const [goals, setGoals] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetIncome = () => {
    if (!monthlyIncome || monthlyIncome <= 0) {
      alert("Please enter a valid monthly income");
      return;
    }
    localStorage.setItem(`monthlyIncome_${userId}`, monthlyIncome);
    window.dispatchEvent(new Event('incomeUpdated'));
    alert("Monthly income updated!");
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      alert("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      const data = await createGoal({
        userId,
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        targetDate: formData.targetDate
      });
      
      const goalDetails = await getGoal(data.goalId);
      setGoals([...goals, goalDetails]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        targetAmount: "",
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Failed to create goal:", error);
      alert("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (goal) => {
    if (!goal || !goal.goal) return 0;
    return (goal.completion * 100).toFixed(0);
  };

  const storedIncome = localStorage.getItem(`monthlyIncome_${userId}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Goals</h1>
        <p className="text-slate-600 mt-1">Manage and plan savings goals.</p>
      </div>

      {/* Monthly Income Input */}
      <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Monthly Income</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-3">
              Your Monthly Income
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder={storedIncome ? `Current: $${storedIncome}` : "Enter your monthly income"}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
          <button
            onClick={handleSetIncome}
            className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set Income
          </button>
          {storedIncome && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-base font-medium text-green-700 flex items-center gap-2">
                <span className="text-xl">✓</span>
                <span>Income set to ${parseFloat(storedIncome).toLocaleString()}/month</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Goal */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Create Goal</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {showCreateForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateGoal} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Emergency Fund"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </form>
        )}
      </div>

      {/* Active Goals */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Goals</h2>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{goal.goal?.name || 'Goal'}</h3>
                  <span className="text-sm font-medium text-green-600">
                    {calculateProgress(goal)}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all" 
                    style={{ width: `${calculateProgress(goal)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-slate-600">
                  Target: ${goal.goal?.targetAmount?.toLocaleString() || 0} • 
                  Due: {goal.goal?.targetDate ? new Date(goal.goal.targetDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
