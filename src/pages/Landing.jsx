import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Brain, 
  Shield, 
  Smartphone,
  Moon,
  Sun
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Get intelligent spending analysis and personalized financial recommendations',
    },
    {
      icon: TrendingUp,
      title: 'Smart Tracking',
      description: 'Effortlessly track your daily expenses with our intuitive interface',
    },
    {
      icon: Target,
      title: 'Budget & Goals',
      description: 'Set budgets, track savings goals, and stay on top of your finances',
    },
    {
      icon: Brain,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs to understand your spending patterns',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely',
    },
    {
      icon: Smartphone,
      title: 'Always Accessible',
      description: 'Access your finances anywhere, anytime on any device',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SpendWise AI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              AI-Powered Personal Finance
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              Finances with AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            The smart way to track expenses, analyze spending habits, and achieve your financial goals. 
            Built for students and young professionals who want to make smarter money decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isAuthenticated && (
              <>
                <Link
                  to="/signup"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Free Today
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 lg:px-8 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features to manage your finances effortlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card card-hover p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who are already managing their money smarter with SpendWise AI
            </p>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="inline-block bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-8 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 SpendWise AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;









