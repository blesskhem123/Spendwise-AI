import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ExpenseModal from '../components/ExpenseModal';
import { EXPENSE_CATEGORIES, TRANSACTION_TYPES, CURRENCY } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, statsRes] = await Promise.all([
        api.get('/transactions?limit=10').catch(() => ({ data: { transactions: [] } })),
        api.get('/transactions/stats').catch(() => ({ 
          data: { 
            balance: 0, 
            monthlyIncome: 0, 
            monthlyExpense: 0 
          } 
        })),
      ]);

      setTransactions(transactionsRes.data.transactions || []);
      setBalance(statsRes.data.balance || 0);
      setMonthlyIncome(statsRes.data.monthlyIncome || 0);
      setMonthlyExpense(statsRes.data.monthlyExpense || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (formData) => {
    try {
      const response = await api.post('/transactions', formData);
      toast.success('Transaction added successfully!');
      fetchDashboardData();
      return response.data;
    } catch (error) {
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  // Prepare chart data
  const categoryData = transactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((acc, transaction) => {
      const category = EXPENSE_CATEGORIES.find(c => c.value === transaction.category);
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          name: category?.label || transaction.category,
          value: 0,
          color: category?.color || '#6b7280',
        };
      }
      acc[transaction.category].value += parseFloat(transaction.amount) || 0;
      return acc;
    }, {});

  const pieChartData = Object.values(categoryData);

  // Monthly income vs expense data (last 6 months simulation)
  const monthlyData = [
    { month: 'Jan', income: monthlyIncome * 0.9, expense: monthlyExpense * 0.95 },
    { month: 'Feb', income: monthlyIncome * 0.85, expense: monthlyExpense * 1.1 },
    { month: 'Mar', income: monthlyIncome * 1.1, expense: monthlyExpense * 0.9 },
    { month: 'Apr', income: monthlyIncome * 0.95, expense: monthlyExpense * 1.05 },
    { month: 'May', income: monthlyIncome * 1.05, expense: monthlyExpense * 0.88 },
    { month: 'Jun', income: monthlyIncome, expense: monthlyExpense },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-32 mb-4"></div>
              <div className="skeleton h-10 w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="card p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <p className="text-primary-100 text-sm mb-1">Total Balance</p>
          <p className="text-3xl font-bold">{CURRENCY}{balance.toLocaleString('en-IN')}</p>
        </div>

        {/* Monthly Income */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Monthly Income</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {CURRENCY}{monthlyIncome.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Monthly Expense */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Monthly Expense</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {CURRENCY}{monthlyExpense.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income vs Expense Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Income vs Expense
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-bg-white, white)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Expense by Category
          </h2>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${CURRENCY}${value.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const category = EXPENSE_CATEGORIES.find(c => c.value === transaction.category);
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
              
              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category?.color + '20' || '#6b728020' }}
                    >
                      {category?.icon || '📦'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category?.label || transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isIncome ? '+' : '-'}{CURRENCY}{parseFloat(transaction.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <Plus size={24} />
      </button>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;
