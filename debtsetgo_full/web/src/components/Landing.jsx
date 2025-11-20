import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Target, PieChart, CreditCard, Sparkles, Calculator, TrendingUp, Brain, BookOpen, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const features = document.getElementById('features');
    if (features) {
      features.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Build assets, not debt.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                AI-powered planning, clear budgets, and student-first guidance — all in one place.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center shadow-lg hover:shadow-xl"
              >
                Start free
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                See features
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              <div>
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-slate-600">Free to start</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">AI</div>
                <div className="text-sm text-slate-600">Powered insights</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-slate-600">Always available</div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 p-8 shadow-xl">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
                
                {/* Mock Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="h-3 bg-blue-200 rounded w-12 mb-2"></div>
                    <div className="h-6 bg-blue-300 rounded w-16"></div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="h-3 bg-green-200 rounded w-12 mb-2"></div>
                    <div className="h-6 bg-green-300 rounded w-16"></div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="h-3 bg-purple-200 rounded w-12 mb-2"></div>
                    <div className="h-6 bg-purple-300 rounded w-16"></div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="bg-slate-50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="flex items-end gap-2 h-full">
                    {[40, 60, 50, 70, 65, 80].map((h, i) => (
                      <div
                        key={i}
                        className="bg-blue-500 rounded-t w-8 transition-all hover:bg-blue-600"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-xl text-slate-600">
              Powerful tools designed for students and young professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Goal Planner</h3>
              <p className="text-slate-600 leading-relaxed">
                Set financial targets and track your progress with AI-powered suggestions tailored to your income and expenses.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Budget Tracker</h3>
              <p className="text-slate-600 leading-relaxed">
                Plan vs actual spending with clear visual charts. Get insights into where your money goes and optimize your budget.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Transaction Management</h3>
              <p className="text-slate-600 leading-relaxed">
                Auto-categorize expenses, track transactions, and get smart suggestions to improve your financial habits.
              </p>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                AI-Powered Financial Tools
              </h2>
              <p className="text-xl text-slate-600">
                Leverage artificial intelligence to make smarter financial decisions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* AI Credit Coach */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Credit Coach</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Get personalized tips and reminders to build a strong credit history and improve your credit score.
                </p>
              </div>

              {/* Tax Advisor */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-purple-500 hover:shadow-lg transition-all">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">State-Wise Tax Advisor</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Understand your state-specific tax rules and get accurate tax refund estimates.
                </p>
              </div>

              {/* Investment Recommender */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-green-500 hover:shadow-lg transition-all">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Investment Recommender</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Discover safe, student-friendly investment options tailored to your risk profile and goals.
                </p>
              </div>

              {/* What-If Simulator */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">What-If Simulator</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Compare scenarios like saving vs. investing and see long-term financial impact.
                </p>
              </div>

              {/* AI Mistake-Learner */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-red-500 hover:shadow-lg transition-all">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Mistake-Learner</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Spot patterns in your behavior and prevent repeat financial mistakes with AI analysis.
                </p>
              </div>

              {/* Educational Library */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-indigo-500 hover:shadow-lg transition-all">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Educational Library</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Learn the basics of credit, taxes, saving, and investing in plain English.
                </p>
              </div>

              {/* Peer Forum */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-pink-500 hover:shadow-lg transition-all">
                <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Peer Forum</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ask questions, share wins, and get moderated community support from peers.
                </p>
              </div>

              {/* More Tools Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-6 hover:border-green-500 hover:shadow-lg transition-all">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">And More...</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Explore additional AI-powered tools and features to enhance your financial journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of students and professionals building better financial futures.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 hover:bg-slate-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Logo size="sm" showText={false} />
            <div className="text-sm">
              © 2025 DebtSetGo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

