import { useNavigate } from "react-router-dom";
import { Sparkles, Calculator, TrendingUp, BookOpen, MessageCircle, Brain } from "lucide-react";

export default function AIToolsPage() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'credit-coach',
      title: 'AI Credit Coach',
      description: 'Get personalized tips and reminders to build a strong credit history.',
      icon: Sparkles,
      color: 'blue',
      route: '/credit-coach'
    },
    {
      id: 'tax-advisor',
      title: 'State-Wise Tax Advisor',
      description: 'Understand your state-specific tax rules and estimate refunds.',
      icon: Calculator,
      color: 'purple',
      route: '/tax-advisor'
    },
    {
      id: 'investments',
      title: 'Investment Recommender',
      description: 'Discover safe, student-friendly investment options tailored to you.',
      icon: TrendingUp,
      color: 'green',
      route: '/investments'
    },
    {
      id: 'what-if',
      title: 'What-If Simulator',
      description: 'Compare scenarios like saving vs. investing and see long-term impact.',
      icon: Brain,
      color: 'orange',
      route: '/what-if'
    },
    {
      id: 'ai-mistakes',
      title: 'AI Mistake-Learner',
      description: 'Spot patterns in your behavior and prevent repeat financial mistakes.',
      icon: Brain,
      color: 'red',
      route: '/ai-mistakes'
    },
    {
      id: 'library',
      title: 'Educational Library',
      description: 'Learn the basics of credit, taxes, saving, and investing in plain English.',
      icon: BookOpen,
      color: 'indigo',
      route: '/library'
    },
    {
      id: 'forum',
      title: 'Peer Forum',
      description: 'Ask questions, share wins, and get moderated community support.',
      icon: MessageCircle,
      color: 'pink',
      route: '/forum'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Tools</h1>
        <p className="text-slate-600 mt-1">Access powerful AI-powered financial tools and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-green-300 transition-all cursor-pointer"
              onClick={() => navigate(tool.route)}
            >
              <div className={`w-12 h-12 ${colorClasses[tool.color]} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{tool.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
              <button
                className="mt-4 w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(tool.route);
                }}
              >
                <span>Open tool</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

