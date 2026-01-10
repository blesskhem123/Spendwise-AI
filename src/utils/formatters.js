import { format } from 'date-fns';
import { CURRENCY } from './constants';

/**
 * Format currency amount with Indian Rupee symbol
 */
export const formatCurrency = (amount) => {
  return `${CURRENCY}${parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return date;
  }
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category, categories) => {
  const cat = categories.find(c => c.value === category);
  return cat?.icon || '📦';
};

/**
 * Get category label
 */
export const getCategoryLabel = (category, categories) => {
  const cat = categories.find(c => c.value === category);
  return cat?.label || category;
};









