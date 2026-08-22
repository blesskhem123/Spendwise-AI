import axios from 'axios';

// ---- Stat computation (shared by both LLM and rule-based paths) ----
// Pure function: takes a user's transactions, returns structured numbers.
// No text generation here — this is the "ground truth" both paths reason over.
export function computeStats(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const inMonth = (t, month, year) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  const currentMonthTx = transactions.filter((t) => inMonth(t, currentMonth, currentYear));
  const lastMonthTx = transactions.filter((t) => inMonth(t, lastMonth, lastMonthYear));

  const sum = (list, type) =>
    list.filter((t) => t.type === type).reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const currentMonthExpenses = sum(currentMonthTx, 'expense');
  const lastMonthExpenses = sum(lastMonthTx, 'expense');
  const currentMonthIncome = sum(currentMonthTx, 'income');

  const categorySpending = {};
  currentMonthTx
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + parseFloat(t.amount || 0);
    });

  const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const averageDaily = currentMonthExpenses / daysInMonth;
  const savingsRate =
    currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : null;
  const monthOverMonthChangePct =
    lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : null;

  return {
    currentMonthExpenses,
    lastMonthExpenses,
    currentMonthIncome,
    savingsRate,
    monthOverMonthChangePct,
    averageDaily,
    topCategories: sortedCategories.slice(0, 5).map(([category, amount]) => ({
      category,
      amount,
      percentOfTotal: currentMonthExpenses > 0 ? (amount / currentMonthExpenses) * 100 : 0,
    })),
    transactionCount: currentMonthTx.length,
  };
}

const VALID_TYPES = ['success', 'warning', 'danger', 'info', 'tip'];

// ---- Rule-based fallback (same logic the app used to run client-side) ----
export function generateRuleBasedInsights(stats) {
  const insights = [];
  const { currentMonthExpenses, lastMonthExpenses, currentMonthIncome, savingsRate, monthOverMonthChangePct, topCategories, averageDaily } = stats;

  if (monthOverMonthChangePct !== null && Math.abs(monthOverMonthChangePct) > 5) {
    const change = monthOverMonthChangePct;
    insights.push({
      type: change > 0 ? 'warning' : 'success',
      title: `You're spending ${Math.abs(change).toFixed(0)}% ${change > 0 ? 'more' : 'less'} this month`,
      description: `Compared to last month, your expenses have ${change > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(currentMonthExpenses - lastMonthExpenses).toLocaleString('en-IN')}.`,
    });
  }

  if (topCategories.length > 0 && topCategories[0].percentOfTotal > 30) {
    const top = topCategories[0];
    insights.push({
      type: 'info',
      title: `${top.category} is your biggest expense`,
      description: `You've spent ₹${top.amount.toLocaleString('en-IN')} (${top.percentOfTotal.toFixed(0)}% of total) on ${top.category} this month.`,
    });
  }

  if (savingsRate !== null) {
    if (savingsRate < 0) {
      insights.push({
        type: 'danger',
        title: "You're spending more than you earn",
        description: `Your expenses exceed your income by ₹${Math.abs(currentMonthIncome - currentMonthExpenses).toLocaleString('en-IN')}. Consider reviewing your budget.`,
      });
    } else if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low savings rate detected',
        description: `You're saving only ${savingsRate.toFixed(1)}% of your income. Consider reducing discretionary spending to increase your savings.`,
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'success',
        title: 'Great savings rate!',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the excellent work!`,
      });
    }
  }

  if (topCategories.length >= 3) {
    const topThreePct = topCategories.slice(0, 3).reduce((s, c) => s + c.percentOfTotal, 0);
    if (topThreePct > 70) {
      insights.push({
        type: 'info',
        title: 'Concentrated spending pattern',
        description: `Your top 3 categories account for ${topThreePct.toFixed(0)}% of your spending. Consider diversifying your expenses.`,
      });
    }
  }

  if (currentMonthExpenses > 0) {
    insights.push({
      type: 'info',
      title: 'Daily spending average',
      description: `You're spending an average of ₹${averageDaily.toFixed(0)} per day this month.`,
    });
  }

  if (lastMonthExpenses > 0 && currentMonthExpenses > lastMonthExpenses) {
    const potentialSavings = (currentMonthExpenses - lastMonthExpenses) * 0.8;
    insights.push({
      type: 'tip',
      title: 'Potential savings opportunity',
      description: `By optimizing your spending to last month's level, you could save approximately ₹${potentialSavings.toLocaleString('en-IN')} per month.`,
    });
  }

  return insights;
}

// ---- LLM primary path ----
async function generateLLMInsights(stats) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `You are a personal finance assistant. Given this user's spending data for the current month, generate 3-5 concise, actionable insights.

Data:
${JSON.stringify(stats, null, 2)}

Respond with ONLY a JSON array (no markdown, no prose) of objects, each with exactly these fields:
- "type": one of "success", "warning", "danger", "info", "tip"
- "title": a short headline (under 10 words)
- "description": one or two sentences with specific numbers from the data

Use "success" for good trends, "warning" for concerning trends, "danger" for serious problems (e.g. overspending income), "info" for neutral observations, "tip" for actionable suggestions.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    }
  );

  const raw = response.data.choices?.[0]?.message?.content?.trim();
  let parsed;
  try {
    // Strip accidental markdown fences if the model adds them anyway
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, '');
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('LLM returned unparseable JSON');
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('LLM returned empty or non-array insights');
  }

  const validated = parsed.filter(
    (i) => i && VALID_TYPES.includes(i.type) && typeof i.title === 'string' && typeof i.description === 'string'
  );

  if (validated.length === 0) {
    throw new Error('No valid insight objects in LLM response');
  }

  return validated;
}

// ---- Public entry point: LLM primary, rule-based fallback ----
export async function generateInsights(transactions) {
  const stats = computeStats(transactions);

  if (stats.transactionCount === 0 && stats.currentMonthExpenses === 0) {
    return { insights: [], source: 'none', stats };
  }

  try {
    const insights = await generateLLMInsights(stats);
    return { insights, source: 'llm', stats };
  } catch (err) {
    console.warn(`LLM insights generation failed (${err.message}), falling back to rule-based insights`);
    return { insights: generateRuleBasedInsights(stats), source: 'rule-based', stats };
  }
}