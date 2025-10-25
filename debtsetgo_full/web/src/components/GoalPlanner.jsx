import { useState } from "react";
import { createGoal, getGoal } from "../api";

export default function GoalPlanner({ userId }) {
  const [goalId, setGoalId] = useState(null);
  const [goal, setGoal] = useState(null);
  const [name, setName] = useState("Emergency Fund");
  const [amount, setAmount] = useState(500);
  const [date, setDate] = useState("2025-12-31");

  async function handleCreate() {
   // const data = await createGoal({ userId: 1, name, targetAmount: Number(amount), targetDate: date });
    const data = await createGoal({ userId, name, targetAmount: Number(amount), targetDate: date });
    setGoalId(data.goalId);
    const g = await getGoal(data.goalId);
    setGoal(g);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>AI Goal Planner</h2>
      <div className="row">
        <input value={name} onChange={e => setName(e.target.value)} />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={handleCreate}>Create Goal</button>
      </div>
      {goal && (
        <div className="panel">
          <p><b>{goal.goal.name}</b> — completion {(goal.completion * 100).toFixed(0)}%</p>
          <ul>{goal.steps.map(s => (
            <li key={s.step_id}>{s.description} (due {new Date(s.due_date).toLocaleDateString()})</li>
          ))}</ul>
        </div>
      )}
    </div>
  );
}
