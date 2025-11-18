import { useState } from "react";
import { addExpense, getSuggestions } from "../api";

export default function BudgetTracker({ userId }) {
  const [amount, setAmount] = useState(20);
  const [category, setCategory] = useState("Grocery");
  const [budgetId, setBudgetId] = useState(null);
  const [monthlyTotal, setMonthlyTotal] = useState(0);   // ⭐ 新增
  const [tips, setTips] = useState([]);

  async function handleAdd() {
    const res = await addExpense({ userId, amount: Number(amount), category });

    // 调试用：可以在控制台看到返回值
    console.log("addExpense response:", res);

    setBudgetId(res.budgetId);

    // 后端返回的是字符串 "412.00"，这里转成数字
    if (res.monthlyTotal !== undefined && res.monthlyTotal !== null) {
      setMonthlyTotal(Number(res.monthlyTotal));
    }

    const s = await getSuggestions(res.budgetId);
    setTips(s);
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
