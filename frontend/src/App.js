import { useState, useEffect } from 'react';
import '@/App.css';
import axios from 'axios';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseChart from '@/components/ExpenseChart';
import FilterBar from '@/components/FilterBar';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  // Fetch expenses
  const fetchExpenses = async (filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterParams.category) params.append('category', filterParams.category);
      if (filterParams.dateFrom) params.append('date_from', filterParams.dateFrom);
      if (filterParams.dateTo) params.append('date_to', filterParams.dateTo);
      
      const response = await axios.get(`${API}/expenses?${params.toString()}`);
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API}/expenses/summary`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  // Handle add/update expense
  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await axios.put(`${API}/expenses/${editingExpense.id}`, expenseData);
        toast.success('Expense updated successfully!');
      } else {
        await axios.post(`${API}/expenses`, expenseData);
        toast.success('Expense added successfully!');
      }
      setEditingExpense(null);
      fetchExpenses(filters);
      fetchSummary();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error(error.response?.data?.detail || 'Failed to save expense');
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      toast.success('Expense deleted successfully!');
      fetchExpenses(filters);
      fetchSummary();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  // Handle export CSV
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      
      const response = await axios.get(`${API}/expenses/export/csv?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Expenses exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export expenses');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="app-title">
                💰 Mini Expense Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">Track your spending, stay in control</p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={expenses.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="export-csv-button"
            >
              📥 Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Section */}
        {summary && (
          <div className="mb-8">
            <ExpenseSummary summary={summary} />
          </div>
        )}

        {/* Chart Section */}
        {summary && summary.total_per_category && Object.keys(summary.total_per_category).length > 0 && (
          <div className="mb-8">
            <ExpenseChart categoryData={summary.total_per_category} />
          </div>
        )}

        {/* Expense Form */}
        <div className="mb-8">
          <ExpenseForm
            onSave={handleSaveExpense}
            editingExpense={editingExpense}
            onCancel={() => setEditingExpense(null)}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={filteredExpenses}
          loading={loading}
          onEdit={setEditingExpense}
          onDelete={handleDeleteExpense}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>Mini Expense Tracker - Full Stack Developer </p>
          <p className="mt-1">Built with React, FastAPI, MongoDB & Tailwind CSS</p>
          <p> Developed by Amanjeet </p>
        </div>
      </footer>
    </div>
  );
}

export default App;