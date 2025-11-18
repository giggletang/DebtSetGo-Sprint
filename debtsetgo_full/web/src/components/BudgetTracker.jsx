import { useState, useEffect, useCallback } from "react";
import { addExpense, getSuggestions, getTransactions } from "../api";

export default function BudgetTracker({ userId }) {
  const [amount, setAmount] = useState(20);
  const [category, setCategory] = useState("Grocery");
  const [budgetId, setBudgetId] = useState(null);
  const [monthlyTotal, setMonthlyTotal] = useState(0);   
  const [tips, setTips] = useState([]);
  const [transactions, setTransactions] = useState([]); // state for transaction

  const fetchTransactions = useCallback(async () => {
    try {
      if (budgetId) { 
        const transactionsData = await getTransactions(budgetId);
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }, [budgetId]);
   //  Fetch transactions when budgetId changes
  useEffect(() => {
    if (budgetId) {
      fetchTransactions();
    }
  }, [budgetId, fetchTransactions]);


  async function handleAdd() {
    try {
      // validation
      if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (!category.trim()) {
        alert("Please enter a category");
        return;
      }

      const res = await addExpense({ 
        userId, 
        amount: Number(amount), 
        category: category.trim() 
      });

      console.log("addExpense response:", res);

      setBudgetId(res.budgetId);

    // For debugging: you can see the return value in console
    console.log("addExpense response:", res);

    setBudgetId(res.budgetId);

    // Backend returns a string like "412.00", convert to number here
    if (res.monthlyTotal !== undefined && res.monthlyTotal !== null) {
      setMonthlyTotal(Number(res.monthlyTotal));
    }

    // Refresh transactions after adding new expense
    await fetchTransactions();

    const s = await getSuggestions(res.budgetId);
    setTips(s);
  } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  }

   //  Format date for display
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="module">
      <h2>Budget Tracker</h2>

      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <input
        value={category}
        onChange={e => setCategory(e.target.value)}
      />

      <button onClick={handleAdd}>Add Expense</button>

      {budgetId && (
        <p>
          Current Month Total: <strong>${monthlyTotal}</strong>
        </p>
      )}
      {/* Transactions Table */}
      {transactions.length > 0 && (
        <div className="transactions-table">
          <h3 className="section-subtitle">Expense History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.txn_id}>
                  <td>{formatDate(transaction.txn_date)}</td>
                  <td>{transaction.category}</td>
                  <td>${Number(transaction.amount).toFixed(2)}</td>
                  <td>#{transaction.txn_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tips.length > 0 && (
        <div className="panel">
          <h3>Smart Suggestions</h3>
          <ul>
            {tips.map(t => (
              <li key={t.suggestion_id}>{t.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}