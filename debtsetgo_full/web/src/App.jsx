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
import GoalPlanner from "./components/GoalPlanner";
import BudgetTracker from "./components/BudgetTracker";
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
import { getMembershipStatus } from "./api";

import "./styles.css";

/* 顶栏 + 布局（登录后页面通用外壳） */
function AppLayout({ userId, userName, onLogout, children }) {
  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-left">
          <Link to="/app" className="topbar-logo">
            DebtSetGo
          </Link>
        </div>

        <div className="topbar-right">
          <Link to="/profile" className="topbar-username">
            {userName || "Profile"}
          </Link>
          <button className="topbar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">{children}</div>
    </div>
  );
}

/* 登录后的主界面：Dashboard */
function Dashboard({ userId, userName, navigate }) {
  const [isMember, setIsMember] = useState(false);
  const [membershipPlan, setMembershipPlan] = useState(null);

  useEffect(() => {
    if (!userId) return;

    getMembershipStatus(userId)
      .then((res) => {
        setIsMember(res.isMember);
        setMembershipPlan(res.membershipPlan);
      })
      .catch((err) => {
        console.error("Failed to load membership status", err);
      });
  }, [userId]);

  return (
    <>
      {/* 顶部大蓝条：左文字 + 右侧根据会员状态切换 */}
      <header className="hero-header hero-header-row">
        <div className="hero-text">
          <h1>DebtSetGo</h1>
          <p>Plan Goals. Track Spending. Grow Financial Freedom.</p>
        </div>

        {!isMember ? (
          // 非会员：显示 Join Membership 按钮
          <button
            className="hero-membership-btn"
            onClick={() => navigate("/membership")}
          >
            Join Membership
          </button>
        ) : (
          // 已是会员：显示欢迎文字（带用户名）
          <div className="membership-welcome">
            Welcome valued member, <strong>{userName}</strong>!
          </div>
        )}
      </header>

    
      <h2 className="section-title">Core Tools</h2>

      {/* 已经实现的两个核心工具：AI Goal Planner + Budget Tracker */}
      <div className="grid dashboard-core-grid">
        <GoalPlanner userId={userId} />
        <BudgetTracker userId={userId} />
      </div>

      {/* 其它功能模块：作为板块卡片展示 + 跳转按钮 */}
      <section className="feature-section">
        <h2 className="section-title">Explore More Tools</h2>
        <p className="section-subtitle">
          Access AI-powered credit coaching, tax advice, investment suggestions,
          simulations, and more.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>AI Credit Coach</h3>
            <p>
              Get personalized tips and reminders to build a strong credit
              history.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/credit-coach")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>State-Wise Tax Advisor</h3>
            <p>Understand your state-specific tax rules and estimate refunds.</p>
            <button
              className="feature-btn"
              onClick={() => navigate("/tax-advisor")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>Investment Recommender</h3>
            <p>
              Discover safe, student-friendly investment options tailored to
              you.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/investments")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>What-If Simulator</h3>
            <p>
              Compare scenarios like saving vs. investing and see long-term
              impact.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/what-if")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>AI Mistake-Learner</h3>
            <p>
              Spot patterns in your behavior and prevent repeat financial
              mistakes.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/ai-mistakes")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>Educational Library</h3>
            <p>
              Learn the basics of credit, taxes, saving, and investing in plain
              English.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/library")}
            >
              Open
            </button>
          </div>

          <div className="feature-card">
            <h3>Peer Forum &amp; Admin Dashboard</h3>
            <p>
              Ask questions, share wins, and get moderated community support.
            </p>
            <button
              className="feature-btn"
              onClick={() => navigate("/forum")}
            >
              Open
            </button>
          </div>

          {/* 主页上已按需求移除 Smart Payment Suggestions 模块 */}
        </div>
      </section>
    </>
  );
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

  /* 未登录：只允许访问登录 / 注册 */
  if (!userId) {
    return (
      <Routes>
        <Route
          path="/"
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
