import { useState } from "react";
import Auth from "./components/Auth";
import GoalPlanner from "./components/GoalPlanner";
import BudgetTracker from "./components/BudgetTracker";
import "./styles.css";

export default function App() {
  
  const [userId, setUserId] = useState(null);
  if (!userId) return <Auth setUserId={setUserId} />;
  
  return (
    <div className="container">
      <header>
+       <h1>DebtSetGo</h1>
+       <p>Plan Goals. Track Spending. Grow Financial Freedom.</p>
+     </header>
      <h1>Welcome User {userId}</h1>
      <h1>DebtSetGo – Core Features</h1>
      <div className="grid">
        <GoalPlanner userId={userId} />
        <BudgetTracker userId={userId} />
      </div>
    </div>
  );
}
