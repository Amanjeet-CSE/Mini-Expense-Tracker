import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const FilterBar = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = { category: '', dateFrom: '', dateTo: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getMonthRange = (monthsAgo) => {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    return {
      dateFrom: startDate.toISOString().split('T')[0],
      dateTo: endDate.toISOString().split('T')[0]
    };
  };

  const handleQuickFilter = (type) => {
    let newFilters = { ...localFilters };
    
    switch(type) {
      case 'this-month':
        newFilters = { ...newFilters, ...getMonthRange(0) };
        break;
      case 'last-month':
        newFilters = { ...newFilters, ...getMonthRange(1) };
        break;
      case 'last-3-months':
        newFilters = { ...newFilters, ...getMonthRange(2) };
        break;
      default:
        break;
    }
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="shadow-md" data-testid="filter-bar">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">⚡ Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter('this-month')}
                data-testid="quick-filter-this-month"
              >
                📅 This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter('last-month')}
                data-testid="quick-filter-last-month"
              >
                📅 Last Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter('last-3-months')}
                data-testid="quick-filter-last-3-months"
              >
                📅 Last 3 Months
              </Button>
            </div>
          </div>

          {/* Custom Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <Label htmlFor="filter-category" className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </Label>
              <Select
                value={localFilters.category || 'All'}
                onValueChange={(value) => setLocalFilters({ ...localFilters, category: value === 'All' ? '' : value })}
              >
                <SelectTrigger data-testid="filter-category-select">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} data-testid={`filter-category-${cat.toLowerCase()}`}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Label htmlFor="filter-date-from" className="text-sm font-medium text-gray-700 mb-2 block">
                From Date
              </Label>
              <Input
                id="filter-date-from"
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                data-testid="filter-date-from"
              />
            </div>

            {/* Date To */}
            <div>
              <Label htmlFor="filter-date-to" className="text-sm font-medium text-gray-700 mb-2 block">
                To Date
              </Label>
              <Input
                id="filter-date-to"
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                data-testid="filter-date-to"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                data-testid="apply-filters-button"
              >
                🔍 Apply
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                data-testid="reset-filters-button"
              >
                🔄 Reset
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;