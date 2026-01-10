import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Target, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { CURRENCY } from '../utils/constants';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, goalsRes, statsRes] = await Promise.all([
        api.get('/budgets').catch(() => ({ data: { budgets: [] } })),
        api.get('/goals').catch(() => ({ data: { goals: [] } })),
        api.get('/transactions/stats').catch(() => ({ data: { monthlyExpense: 0 } })),
      ]);

      setBudgets(budgetsRes.data.budgets || []);
      setSavingsGoals(goalsRes.data.goals || []);
      setMonthlyExpense(statsRes.data.monthlyExpense || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (formData) => {
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, formData);
        toast.success('Budget updated successfully!');
      } else {
        await api.post('/budgets', formData);
        toast.success('Budget created successfully!');
      }
      fetchData();
      setIsBudgetModalOpen(false);
      setEditingBudget(null);
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const handleCreateGoal = async (formData) => {
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, formData);
        toast.success('Goal updated successfully!');
      } else {
        await api.post('/goals', formData);
        toast.success('Goal created successfully!');
      }
      fetchData();
      setIsGoalModalOpen(false);
      setEditingGoal(null);
    } catch (error) {
      toast.error('Failed to save goal');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Budget deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await api.delete(`/goals/${id}`);
      toast.success('Goal deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Budget & Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set budgets and track your savings goals
          </p>
        </div>
      </div>

      {/* Monthly Budget Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Monthly Budgets
          </h2>
          <button
            onClick={() => {
              setEditingBudget(null);
              setIsBudgetModalOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Budget</span>
          </button>
        </div>

        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = budget.spent || 0;
              const limit = budget.limit || 0;
              const percentage = limit > 0 ? (spent / limit) * 100 : 0;
              const isOverBudget = percentage > 100;

              return (
                <div key={budget._id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {budget.month} {budget.year}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingBudget(budget);
                          setIsBudgetModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 size={18} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        {CURRENCY}{spent.toLocaleString('en-IN')} / {CURRENCY}{limit.toLocaleString('en-IN')}
                      </span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          isOverBudget
                            ? 'bg-red-500'
                            : percentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 mt-2">
                      <AlertTriangle size={16} />
                      <span>You've exceeded your budget by {CURRENCY}{(spent - limit).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No budgets set yet. Create your first budget to get started!
            </p>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="btn-primary"
            >
              Create Budget
            </button>
          </div>
        )}
      </div>

      {/* Savings Goals Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Savings Goals
          </h2>
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        </div>

        {savingsGoals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {savingsGoals.map((goal) => {
              const saved = goal.saved || 0;
              const target = goal.target || 0;
              const percentage = target > 0 ? (saved / target) * 100 : 0;

              return (
                <div key={goal._id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 size={18} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {CURRENCY}{saved.toLocaleString('en-IN')} / {CURRENCY}{target.toLocaleString('en-IN')}
                      </span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-primary-500 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage >= 100
                      ? '🎉 Goal achieved!'
                      : `${CURRENCY}${(target - saved).toLocaleString('en-IN')} remaining`}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No savings goals yet. Set your first goal to start saving!
            </p>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="btn-primary"
            >
              Create Goal
            </button>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleCreateBudget}
        budget={editingBudget}
      />

      {/* Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleCreateGoal}
        goal={editingGoal}
      />
    </div>
  );
};

// Budget Modal Component
const BudgetModal = ({ isOpen, onClose, onSubmit, budget }) => {
  const [formData, setFormData] = useState({
    category: 'food',
    limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category || 'food',
        limit: budget.limit || '',
        month: budget.month || new Date().getMonth() + 1,
        year: budget.year || new Date().getFullYear(),
      });
    }
  }, [budget, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.limit) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {budget ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="health">Health & Fitness</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Limit (₹)
                </label>
                <input
                  type="number"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="input-field"
                  placeholder="5000"
                  required
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Month
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="input-field"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="input-field"
                    required
                    min="2020"
                    max="2100"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {budget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Goal Modal Component
const GoalModal = ({ isOpen, onClose, onSubmit, goal }) => {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    saved: '',
    targetDate: '',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        target: goal.target || '',
        saved: goal.saved || '',
        targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        target: '',
        saved: '0',
        targetDate: '',
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {goal ? 'Edit Goal' : 'Create Savings Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Vacation Fund"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="input-field"
                  placeholder="50000"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currently Saved (₹)
                </label>
                <input
                  type="number"
                  value={formData.saved}
                  onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {goal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;









