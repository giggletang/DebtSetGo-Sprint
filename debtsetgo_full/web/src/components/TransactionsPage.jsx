import { useState, useEffect } from "react";
import { addExpense, getTransactions } from "../api";

export default function TransactionsPage({ userId }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [budgetId, setBudgetId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ["Food", "Transport", "Entertainment", "Utilities", "Miscellaneous"];

  useEffect(() => {
    const storedBudgetId = localStorage.getItem(`budgetId_${userId}`);
    if (storedBudgetId) {
      setBudgetId(storedBudgetId);
      loadTransactions(storedBudgetId);
    }
  }, [userId]);

  const loadTransactions = async (bid) => {
    try {
      const data = await getTransactions(bid);
      setTransactions(data.sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date)));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !category.trim()) {
      alert("Please enter a valid amount and category");
      return;
    }

    setLoading(true);
    try {
      const res = await addExpense({
        userId,
        amount: Number(amount),
        category: category.trim(),
        description: description.trim() || category.trim()
      });

      localStorage.setItem(`budgetId_${userId}`, res.budgetId);
      setBudgetId(res.budgetId);
      
      // Trigger custom event for Dashboard to update
      window.dispatchEvent(new Event('budgetUpdated'));
      
      // Clear form
      setAmount("");
      setDescription("");
      setCategory("Food");
      
      // Reload transactions
      await loadTransactions(res.budgetId);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600 mt-1">Track your expenses and income</p>
      </div>

      {/* Add Transaction Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Add Transaction</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
          <span className="text-sm text-slate-500">{transactions.length} transactions</span>
        </div>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.txn_id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">{formatDate(transaction.txn_date)}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{transaction.description || transaction.category}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                      ${Number(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-400 mb-2">No transactions yet</p>
            <p className="text-sm text-slate-500">Add your first transaction above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
