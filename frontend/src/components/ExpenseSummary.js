import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpenseSummary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Transport': '🚗',
      'Bills': '📄',
      'Entertainment': '🎬',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Spent This Month */}
      <Card className="shadow-lg border-l-4 border-l-blue-500" data-testid="total-spent-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            📅 Total Spent This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600" data-testid="total-spent-amount">
            {formatCurrency(summary.total_spent_this_month)}
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="shadow-lg border-l-4 border-l-green-500" data-testid="total-expenses-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            📄 Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600" data-testid="total-expenses-count">
            {summary.total_expenses}
          </p>
          <p className="text-sm text-gray-500 mt-1">transactions</p>
        </CardContent>
      </Card>

      {/* Highest Expense */}
      <Card className="shadow-lg border-l-4 border-l-red-500" data-testid="highest-expense-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            🔺 Highest Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.highest_expense ? (
            <>
              <p className="text-3xl font-bold text-red-600" data-testid="highest-expense-amount">
                {formatCurrency(summary.highest_expense.amount)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getCategoryIcon(summary.highest_expense.category)} {summary.highest_expense.category}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-400">No expenses yet</p>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="shadow-lg border-l-4 border-l-purple-500" data-testid="category-breakdown-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            📊 Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(summary.total_per_category).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(summary.total_per_category)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {getCategoryIcon(category)} {category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No categories yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;