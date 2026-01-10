import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Search, Filter, Edit2, Trash2, Calendar } from 'lucide-react';
import ExpenseModal from '../components/ExpenseModal';
import { EXPENSE_CATEGORIES, TRANSACTION_TYPES, CURRENCY } from '../utils/constants';

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, categoryFilter, typeFilter, dateFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions').catch(() => ({ data: { transactions: [] } }));
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(t => {
        const transactionDate = format(new Date(t.date), 'yyyy-MM-dd');
        return transactionDate === dateFilter;
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (formData) => {
    try {
      await api.post('/transactions', formData);
      toast.success('Transaction added successfully!');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const handleEditTransaction = async (formData) => {
    try {
      await api.put(`/transactions/${editingTransaction._id}`, formData);
      toast.success('Transaction updated successfully!');
      fetchTransactions();
      setEditingTransaction(null);
    } catch (error) {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted successfully!');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingTransaction) {
      handleEditTransaction(formData);
    } else {
      handleAddTransaction(formData);
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-64"></div>
      </div>
    );
  }

  const totalIncome = filteredTransactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expenses & Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your financial transactions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {filteredTransactions.length}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            +{CURRENCY}{totalIncome.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Expense</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            -{CURRENCY}{totalExpense.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder="Search transactions..."
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value={TRANSACTION_TYPES.INCOME}>Income</option>
            <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
          </select>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || categoryFilter !== 'all' || typeFilter !== 'all' || dateFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setTypeFilter('all');
              setDateFilter('');
            }}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="card p-6">
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const category = EXPENSE_CATEGORIES.find(c => c.value === transaction.category);
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;

              return (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: category?.color + '20' || '#6b728020' }}
                    >
                      {category?.icon || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category?.label || transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isIncome ? '+' : '-'}{CURRENCY}{parseFloat(transaction.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(transaction)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 size={18} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {transactions.length === 0
                ? 'No transactions yet. Add your first transaction to get started!'
                : 'No transactions match your filters'}
            </p>
            {transactions.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Add Transaction
              </button>
            )}
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
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        expense={editingTransaction}
      />
    </div>
  );
};

export default Expenses;









