import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';
import { EXPENSE_CATEGORIES, TRANSACTION_TYPES, CURRENCY } from '../utils/constants';
import { format, subMonths } from 'date-fns';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions').catch(() => ({ data: { transactions: [] } }));
      const allTransactions = response.data.transactions || [];
      setTransactions(allTransactions);
      generateInsights(allTransactions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (allTransactions) => {
    const insightsList = [];
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    // Filter transactions by month
    const currentMonthTransactions = allTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth.getMonth() && 
             tDate.getFullYear() === currentMonth.getFullYear();
    });

    const lastMonthTransactions = allTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonth.getMonth() && 
             tDate.getFullYear() === lastMonth.getFullYear();
    });

    // Calculate totals
    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    // Monthly comparison
    if (lastMonthExpenses > 0) {
      const change = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (Math.abs(change) > 5) {
        insightsList.push({
          type: change > 0 ? 'warning' : 'success',
          icon: change > 0 ? TrendingUp : TrendingDown,
          title: `You're spending ${Math.abs(change).toFixed(0)}% ${change > 0 ? 'more' : 'less'} this month`,
          description: `Compared to last month, your expenses have ${change > 0 ? 'increased' : 'decreased'} by ${CURRENCY}${Math.abs(currentMonthExpenses - lastMonthExpenses).toLocaleString('en-IN')}.`,
        });
      }
    }

    // Category analysis
    const categorySpending = {};
    currentMonthTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .forEach(t => {
        if (!categorySpending[t.category]) {
          categorySpending[t.category] = 0;
        }
        categorySpending[t.category] += parseFloat(t.amount || 0);
      });

    const sortedCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const categoryInfo = EXPENSE_CATEGORIES.find(c => c.value === topCategory[0]);
      const topCategoryPercentage = (topCategory[1] / currentMonthExpenses) * 100;

      if (topCategoryPercentage > 30) {
        insightsList.push({
          type: 'info',
          icon: AlertCircle,
          title: `${categoryInfo?.label || topCategory[0]} is your biggest expense`,
          description: `You've spent ${CURRENCY}${topCategory[1].toLocaleString('en-IN')} (${topCategoryPercentage.toFixed(0)}% of total) on ${categoryInfo?.label || topCategory[0]} this month.`,
        });
      }
    }

    // Savings potential
    if (currentMonthIncome > 0 && currentMonthExpenses > 0) {
      const savingsRate = ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100;
      
      if (savingsRate < 10 && savingsRate > 0) {
        insightsList.push({
          type: 'warning',
          icon: Lightbulb,
          title: 'Low savings rate detected',
          description: `You're saving only ${savingsRate.toFixed(1)}% of your income. Consider reducing discretionary spending to increase your savings.`,
        });
      } else if (savingsRate < 0) {
        insightsList.push({
          type: 'danger',
          icon: AlertCircle,
          title: 'You\'re spending more than you earn',
          description: `Your expenses exceed your income by ${CURRENCY}${Math.abs(currentMonthIncome - currentMonthExpenses).toLocaleString('en-IN')}. Consider reviewing your budget.`,
        });
      } else if (savingsRate >= 20) {
        insightsList.push({
          type: 'success',
          icon: TrendingUp,
          title: 'Great savings rate!',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the excellent work!`,
        });
      }
    }

    // Spending pattern analysis
    if (sortedCategories.length >= 3) {
      const topThreeTotal = sortedCategories.slice(0, 3).reduce((sum, [, amount]) => sum + amount, 0);
      const topThreePercentage = (topThreeTotal / currentMonthExpenses) * 100;

      if (topThreePercentage > 70) {
        insightsList.push({
          type: 'info',
          icon: Brain,
          title: 'Concentrated spending pattern',
          description: `Your top 3 categories account for ${topThreePercentage.toFixed(0)}% of your spending. Consider diversifying your expenses.`,
        });
      }
    }

    // Average daily spending
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const averageDaily = currentMonthExpenses / daysInMonth;

    if (currentMonthExpenses > 0) {
      insightsList.push({
        type: 'info',
        icon: Brain,
        title: 'Daily spending average',
        description: `You're spending an average of ${CURRENCY}${averageDaily.toFixed(0)} per day this month.`,
      });
    }

    // Goal suggestions
    if (lastMonthExpenses > 0 && currentMonthExpenses > lastMonthExpenses) {
      const potentialSavings = (currentMonthExpenses - lastMonthExpenses) * 0.8;
      insightsList.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Potential savings opportunity',
        description: `By optimizing your spending to last month's level, you could save approximately ${CURRENCY}${potentialSavings.toLocaleString('en-IN')} per month.`,
      });
    }

    setInsights(insightsList);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-48 mb-4"></div>
              <div className="skeleton h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'danger':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'tip':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'tip':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-primary-600 dark:text-primary-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Intelligent analysis of your spending patterns and financial habits
        </p>
      </div>

      {/* Insights Grid */}
      {insights.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`card p-6 border-2 ${getTypeStyles(insight.type)} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 ${getIconColor(insight.type)}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No insights available yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding transactions to get AI-powered insights about your spending habits.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="card p-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              How Insights Work
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our AI analyzes your transaction patterns, compares spending across months, and identifies opportunities 
              for savings. Insights are generated based on your actual spending data and are updated in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;









