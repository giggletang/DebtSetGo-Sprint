import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import DashboardOverview from "./components/DashboardOverview";
import TransactionsPage from "./components/TransactionsPage";
import GoalsPage from "./components/GoalsPage";
import AIToolsPage from "./components/AIToolsPage";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import TaxAdvisor from "./components/TaxAdvisor";
import InvestmentRecommender from "./components/InvestmentRecommender";
import EducationalLibrary from "./components/EducationalLibrary";
import AICreditCoach from "./components/AICreditCoach";
import PeerForum from "./components/PeerForum";
import WhatIfSimulator from "./components/WhatIfSimulator";
import AIMistakeLearner from "./components/AIMistakeLearner";
import MembershipPlans from "./components/MembershipPlans";
import MembershipCheckout from "./components/MembershipCheckout";

import "./styles.css";

/* 顶栏 + 布局（登录后页面通用外壳） */
function AppLayout({ userId, userName, onLogout, children }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar userName={userName} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}

/* Dashboard component - now using DashboardOverview */
function Dashboard({ userId, userName }) {
  return <DashboardOverview userId={userId} userName={userName} />;
}

/* 一些占位组件（保留） */

function CreditCoachPage() {
  return (
    <>
      <h2>AI Credit Coach</h2>
      <p>
        This page will provide personalized credit-building tips, alerts, and
        reminders based on your spending and payment history.
      </p>
    </>
  );
}

function TaxAdvisorPage() {
  return (
    <>
      <h2>State-Wise Tax Advisor</h2>
      <p>
        Here you will be able to view state-specific tax rules and get estimated
        tax refunds based on your profile and location.
      </p>
    </>
  );
}

function InvestmentsPage() {
  return (
    <>
      <h2>Investment Recommender</h2>
      <p>
        This page will suggest safe, student-friendly investment options
        tailored to your goals and risk level.
      </p>
    </>
  );
}

function WhatIfPage() {
  return (
    <>
      <h2>What-If Simulator</h2>
      <p>
        Simulate different scenarios such as saving vs. investing, or paying
        down debt vs. saving cash.
      </p>
    </>
  );
}

function AiMistakesPage() {
  return (
    <>
      <h2>AI Mistake-Learner</h2>
      <p>
        This page will analyze your behavior over time and help you avoid
        repeating costly financial mistakes.
      </p>
    </>
  );
}

function LibraryPage() {
  return (
    <>
      <h2>Educational Library</h2>
      <p>
        Browse beginner-friendly guides on credit, taxes, saving, investing, and
        more.
      </p>
    </>
  );
}

function ForumPage() {
  return (
    <>
      <h2>Peer Forum &amp; Admin Dashboard</h2>
      <p>
        This page will host Q&amp;A threads, peer support, and admin moderation
        tools.
      </p>
    </>
  );
}

function SmartPaymentsPage() {
  return (
    <>
      <h2>Smart Payment Suggestions</h2>
      <p>
        Get recommendations for which card to use and when to pay to optimize
        rewards and credit health.
      </p>
    </>
  );
}

/* App 主组件 */
export default function App() {
  const storedUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const storedUserName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : null;

  const [userId, setUserId] = useState(storedUserId);
  const [userName, setUserName] = useState(storedUserName);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setUserId(null);
    setUserName(null);
    navigate("/");
  };

  /* 未登录：允许访问登录 / 注册 / 首页 */
  if (!userId) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <Login setUserId={setUserId} setUserName={setUserName} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* 已登录：使用带顶栏的布局 + dashboard 作为主界面 */
  return (
    <Routes>
      {/* 默认 / 重定向到 /app */}
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<Navigate to="/app" replace />} />

      <Route
        path="/app"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <Dashboard
              userId={userId}
              userName={userName}
              navigate={navigate}
            />
          </AppLayout>
        }
      />

      <Route
        path="/goals"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <GoalsPage userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/transactions"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <TransactionsPage userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/ai-tools"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <AIToolsPage />
          </AppLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <Profile userId={userId} setUserName={setUserName} />
          </AppLayout>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <EditProfile userId={userId} />
          </AppLayout>
        }
      />

      {/* 功能页面：都用 AppLayout 包裹 */}
      <Route
        path="/credit-coach"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <AICreditCoach userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/tax-advisor"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <TaxAdvisor userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/investments"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <InvestmentRecommender userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/what-if"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <WhatIfSimulator userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/ai-mistakes"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <AIMistakeLearner />
          </AppLayout>
        }
      />

      <Route
        path="/library"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <EducationalLibrary />
          </AppLayout>
        }
      />

      <Route
        path="/forum"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <PeerForum userId={userId} userName={userName} />
          </AppLayout>
        }
      />

      <Route
        path="/smart-payments"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <SmartPaymentsPage />
          </AppLayout>
        }
      />

      {/* 会员相关页面 */}
      <Route
        path="/membership"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <MembershipPlans userId={userId} />
          </AppLayout>
        }
      />

      <Route
        path="/membership/checkout"
        element={
          <AppLayout
            userId={userId}
            userName={userName}
            onLogout={handleLogout}
          >
            <MembershipCheckout userId={userId} />
          </AppLayout>
        }
      />

      {/* 默认重定向到 /app */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
