import { useState } from "react";
import { addExpense, getSuggestions } from "../api";

export default function BudgetTracker({ userId }) {
  const [amount, setAmount] = useState(20);
  const [category, setCategory] = useState("Grocery");
  const [budgetId, setBudgetId] = useState(null);
  const [tips, setTips] = useState([]);

  async function handleAdd() {
    //const res = await addExpense({ userId: 1, amount: Number(amount), category });
    const res = await addExpense({ userId, amount: Number(amount), category });
    setBudgetId(res.budgetId);
    const s = await getSuggestions(res.budgetId);
    setTips(s);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Budget Tracker</h2>
      <div className="row">
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
      </div>

      {budgetId && <p>Budget ID: {budgetId}</p>}

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
