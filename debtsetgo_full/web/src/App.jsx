import GoalPlanner from "./components/GoalPlanner";
import BudgetTracker from "./components/BudgetTracker";
import "./styles.css";

export default function App() {
  return (
    <div className="container">
      <h1>DebtSetGo – Core Features</h1>
      <div className="grid">
        <GoalPlanner />
        <BudgetTracker />
      </div>
    </div>
  );
}
