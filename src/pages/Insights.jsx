import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';

const ICON_BY_TYPE = {
  success: TrendingUp,
  warning: TrendingDown,
  danger: AlertCircle,
  tip: Lightbulb,
  info: Brain,
};

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null); // 'llm' | 'rule-based' | 'none'

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/insights/generate');
      setInsights(data.insights || []);
      setSource(data.source || null);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to load insights');
      setInsights([]);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent analysis of your spending patterns and financial habits
          </p>
        </div>
        {source && source !== 'none' && (
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
            {source === 'llm' ? 'AI-generated' : 'Rule-based'}
          </span>
        )}
      </div>

      {/* Insights Grid */}
      {insights.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = ICON_BY_TYPE[insight.type] || Brain;
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
              Your spending data is analyzed by an LLM to generate natural-language insights, comparing
              spending across months and identifying savings opportunities. If the AI service is
              unavailable, insights fall back to a rule-based analysis so you always see something useful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;