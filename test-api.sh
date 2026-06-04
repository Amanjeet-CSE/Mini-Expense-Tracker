#!/bin/bash

# API Testing Script for Mini Expense Tracker
# Tests all backend endpoints

API_URL="http://localhost:8001/api"

echo "🧪 Mini Expense Tracker - API Testing"
echo "====================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check (GET /)"
curl -s "$API_URL/" | python3 -m json.tool
echo ""

# Test 2: Create Expenses
echo "2️⃣  Creating test expenses..."

# Expense 1
EXPENSE_1=$(curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 450.00,
    "category": "Food",
    "date": "2025-06-03",
    "note": "Grocery shopping"
  }')
ID_1=$(echo $EXPENSE_1 | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Created expense 1: $ID_1"

# Expense 2
EXPENSE_2=$(curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200.00,
    "category": "Transport",
    "date": "2025-06-02",
    "note": "Uber rides"
  }')
ID_2=$(echo $EXPENSE_2 | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Created expense 2: $ID_2"

# Expense 3
EXPENSE_3=$(curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500.00,
    "category": "Bills",
    "date": "2025-06-01",
    "note": "Rent payment"
  }')
ID_3=$(echo $EXPENSE_3 | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Created expense 3: $ID_3"

echo ""

# Test 3: Get All Expenses
echo "3️⃣  Getting all expenses (GET /expenses)"
curl -s "$API_URL/expenses" | python3 -m json.tool | head -30
echo ""

# Test 4: Filter by Category
echo "4️⃣  Filtering by category - Food (GET /expenses?category=Food)"
curl -s "$API_URL/expenses?category=Food" | python3 -m json.tool
echo ""

# Test 5: Get Summary
echo "5️⃣  Getting summary statistics (GET /expenses/summary)"
curl -s "$API_URL/expenses/summary" | python3 -m json.tool
echo ""

# Test 6: Update Expense
echo "6️⃣  Updating expense (PUT /expenses/$ID_1)"
curl -s -X PUT "$API_URL/expenses/$ID_1" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500.00,
    "note": "Updated: Grocery shopping + snacks"
  }' | python3 -m json.tool
echo ""

# Test 7: Delete Expense
echo "7️⃣  Deleting expense (DELETE /expenses/$ID_2)"
curl -s -X DELETE "$API_URL/expenses/$ID_2" | python3 -m json.tool
echo ""

# Test 8: Export CSV
echo "8️⃣  Exporting to CSV (GET /expenses/export/csv)"
curl -s "$API_URL/expenses/export/csv" -o test-export.csv
if [ -f "test-export.csv" ]; then
    echo "✅ CSV exported successfully!"
    echo "Contents:"
    cat test-export.csv
    rm test-export.csv
fi
echo ""

# Test 9: Validation Tests
echo "9️⃣  Testing validation..."

# Negative amount
echo "Testing negative amount (should fail):"
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -100,
    "category": "Food",
    "date": "2025-06-03"
  }' | python3 -m json.tool
echo ""

# Future date
echo "Testing future date (should fail):"
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "category": "Food",
    "date": "2030-12-31"
  }' | python3 -m json.tool
echo ""

# Invalid category
echo "Testing invalid category (should fail):"
curl -s -X POST "$API_URL/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "category": "InvalidCategory",
    "date": "2025-06-03"
  }' | python3 -m json.tool
echo ""

echo "✅ All API tests completed!"
echo ""
