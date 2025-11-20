import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getMembershipStatus } from "../api";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Crown, Sparkles, Calculator, TrendingUp, Brain } from "lucide-react";

export default function DashboardOverview({ userId, userName }) {
  const navigate = useNavigate();
  const [budgetId, setBudgetId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const COLORS = ['#8b5cf6', '#ef4444', '#3b82f6', '#64748b', '#f97316', '#10b981'];

  useEffect(() => {
    // Get budgetId from localStorage
    const storedBudgetId = localStorage.getItem(`budgetId_${userId}`);
    if (storedBudgetId) {
      setBudgetId(storedBudgetId);
      loadTransactions(storedBudgetId);
    }
    
    // Get income from localStorage (set by Goals page)
    const storedIncome = localStorage.getItem(`monthlyIncome_${userId}`);
    if (storedIncome) {
      setMonthlyIncome(Number(storedIncome));
    }
    
    // Check membership status
    const checkMembership = async () => {
      try {
        const status = await getMembershipStatus(userId);
        setIsMember(status.isMember || false);
      } catch (error) {
        console.error("Failed to check membership:", error);
      }
    };
    if (userId) {
      checkMembership();
    }
    
    // Listen for custom events when transactions are added
    const handleBudgetUpdate = () => {
      const currentBudgetId = localStorage.getItem(`budgetId_${userId}`);
      if (currentBudgetId) {
        setBudgetId(currentBudgetId);
        loadTransactions(currentBudgetId);
      }
    };
    
    // Listen for income updates
    const handleIncomeUpdate = () => {
      const currentIncome = localStorage.getItem(`monthlyIncome_${userId}`);
      if (currentIncome) {
        setMonthlyIncome(Number(currentIncome));
      }
    };
    
    window.addEventListener('budgetUpdated', handleBudgetUpdate);
    window.addEventListener('incomeUpdated', handleIncomeUpdate);
    
    return () => {
      window.removeEventListener('budgetUpdated', handleBudgetUpdate);
      window.removeEventListener('incomeUpdated', handleIncomeUpdate);
    };
  }, [userId]);

  const loadTransactions = async (bid) => {
    try {
      const data = await getTransactions(bid);
      setTransactions(data);
      
      // Get current income
      const currentIncome = Number(localStorage.getItem(`monthlyIncome_${userId}`) || 0);
      
      // Calculate monthly total
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthTransactions = data.filter(t => {
        const txnDate = new Date(t.txn_date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      });
      
      const total = monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

      // Prepare chart data (last 6 months) - only if we have transactions
      if (data.length > 0) {
        const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
        const chartDataArray = months.map((month, idx) => {
          const monthIdx = (currentMonth - (5 - idx) + 12) % 12;
          const monthYear = monthIdx > currentMonth ? currentYear - 1 : currentYear;
          const monthTxns = data.filter(t => {
            const txnDate = new Date(t.txn_date);
            return txnDate.getMonth() === monthIdx && txnDate.getFullYear() === monthYear;
          });
          const expenses = monthTxns.reduce((sum, t) => sum + Number(t.amount), 0);
          return {
            month,
            Income: currentIncome || 0,
            Expenses: expenses || 0,
            Savings: (currentIncome || 0) - expenses || 0
          };
        });
        setChartData(chartDataArray);
      } else {
        setChartData([]);
      }

      // Prepare category data - only if we have transactions
      if (monthTransactions.length > 0) {
        const categoryMap = {};
        monthTransactions.forEach(t => {
          const cat = t.category || 'Miscellaneous';
          categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
        });
        
        const categoryArray = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2))
        }));
        setCategoryData(categoryArray);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  // Watch for new transactions and reload when budgetId changes
  useEffect(() => {
    if (budgetId) {
      loadTransactions(budgetId);
    }
  }, [budgetId, monthlyIncome]);

  // Also reload periodically to catch new transactions
  useEffect(() => {
    if (budgetId) {
      const interval = setInterval(() => {
        loadTransactions(budgetId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [budgetId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-900 whitespace-nowrap">
            Welcome back, <span className="whitespace-nowrap">{userName || 'User'}</span>
          </h1>
          {!isMember && (
            <button
              onClick={() => navigate('/membership')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Join Membership</span>
            </button>
          )}
        </div>
        <p className="text-slate-600 hidden md:block">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <p className="text-slate-600 md:hidden">
        Here's your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
      </p>

      {/* Charts - Only Expense Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Income vs Expenses Trend</h3>
          {chartData.length > 0 && transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Savings" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-lg mb-2">No data yet</p>
                <p className="text-sm">Add expenses and income to see your trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">${item.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-lg mb-2">No spending data yet</p>
                <p className="text-sm">Add transactions to see category breakdown</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-900">AI Tools</h2>
          <button
            onClick={() => navigate('/ai-tools')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Explore more tools
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'credit-coach', title: 'AI Credit Coach', icon: Sparkles, color: 'blue', route: '/credit-coach' },
            { id: 'tax-advisor', title: 'Tax Advisor', icon: Calculator, color: 'purple', route: '/tax-advisor' },
            { id: 'investments', title: 'Investments', icon: TrendingUp, color: 'green', route: '/investments' },
            { id: 'what-if', title: 'What-If Simulator', icon: Brain, color: 'orange', route: '/what-if' }
          ].map((tool) => {
            const Icon = tool.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600'
            };
            return (
              <div
                key={tool.id}
                onClick={() => navigate(tool.route)}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-green-300 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 ${colorClasses[tool.color]} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{tool.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
