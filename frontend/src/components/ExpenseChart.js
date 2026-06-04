import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const COLORS = {
  'Food': '#3b82f6',
  'Transport': '#10b981',
  'Bills': '#f59e0b',
  'Entertainment': '#8b5cf6',
  'Other': '#6b7280'
};

const ExpenseChart = ({ categoryData }) => {
  const [chartType, setChartType] = useState('pie');

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category] || '#6b7280'
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg" data-testid="expense-chart">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">📊 Expenses by Category</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'pie' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="text-white hover:bg-white hover:bg-opacity-20"
              data-testid="chart-type-pie"
            >
              🍕 Pie
            </Button>
            <Button
              variant={chartType === 'bar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="text-white hover:bg-white hover:bg-opacity-20"
              data-testid="chart-type-bar"
            >
              📈 Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;