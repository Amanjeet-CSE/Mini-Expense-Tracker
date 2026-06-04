# 💰 Mini Expense Tracker 

Studio Graphene Full Stack Developer Assessment

Developed by Amanjeet 

> Mini Expense Tracker is a full-stack web application developed as part of the Studio Graphene Full Stack Developer Assessment. The application allows users to record daily expenses, organize them by category, analyze spending patterns through charts and summaries, and export expense data in CSV format.
## 📋 Exercise Information

**Selected Exercise:** Exercise 2 - Mini Expense Tracker  
**From:** Full Stack Developer Assessment

This application allows users to track their daily expenses, categorize spending, view analytics, and export data. It features a clean, intuitive interface with interactive charts and comprehensive filtering options.

---

## 🌐 Live Demo

Frontend: [](https://mini-expense-tracker-eosin.vercel.app/)
Backend API: [](https://mini-expense-tracker-uizd.onrender.com/redoc)

---

## ✨ Features

### Must Have (Implemented)
- ✅ **Add Expense:** Add expenses with amount, category, date, and optional notes
- ✅ **View Expenses:** Display all expenses in a sortable table/list (newest first)
- ✅ **Edit & Delete:** Full CRUD operations with confirmation prompts
- ✅ **Filter by Category & Date Range:** Filter expenses with predefined or custom date ranges
- ✅ **Summary Dashboard:** Shows total spent this month, per-category breakdown, and highest expense

### Should Have (Implemented)
- ✅ **Interactive Charts:** Pie and bar charts showing expense distribution by category
- ✅ **Currency Formatting:** Proper INR (₹) formatting throughout the app
- ✅ **Form Validation:** 
  - No negative amounts
  - No future dates
  - Required category selection
- ✅ **Responsive Design:** Mobile-friendly UI that works on all screen sizes

### Nice to Have (Bonus - Implemented)
- ✅ **CSV Export:** Download filtered expenses as CSV file
- ✅ **Data Persistence:** All data stored in MongoDB
- ✅ **Loading States:** Spinners and skeleton screens during data fetching
- ✅ **Empty States:** User-friendly messages when no data exists
- ✅ **Quick Filters:** One-click filters for "This Month", "Last Month", "Last 3 Months"

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI 0.110.1
- **Database:** MongoDB (Motor async driver)
- **Validation:** Pydantic v2
- **Language:** Python 3.10+

### Frontend
- **Framework:** React 19.0.0
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts 3.6.0
- **HTTP Client:** Axios 1.8.4
- **State Management:** React Query (@tanstack/react-query)
- **Toast Notifications:** Sonner

### Development Tools
- **Build Tool:** Create React App with CRACO
- **Process Manager:** Supervisor (for backend/frontend services)
- **Code Quality:** ESLint, Black, isort

---

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py              # FastAPI application with all routes
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.js      # Add/Edit expense form
│   │   │   ├── ExpenseList.js      # Expense table/list view
│   │   │   ├── ExpenseSummary.js   # Summary cards dashboard
│   │   │   ├── ExpenseChart.js     # Pie/Bar chart visualization
│   │   │   ├── FilterBar.js        # Category & date filters
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── App.js             # Main application component
│   │   ├── index.js           # React entry point
│   │   └── App.css            # Global styles
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env                   # Frontend environment variables
├── tests/                     # Test files
└── README.md                  # This file
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** 18+ and **yarn**
- **Python** 3.10+
- **MongoDB** 4.4+ (running locally or remote connection string)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment (optional but recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment variables
   # Edit .env file with your MongoDB connection string:
   # MONGO_URL="mongodb://localhost:27017"
   # DB_NAME="expense_tracker"
   # CORS_ORIGINS="*"
   
   # Start the backend server
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   
   # Install dependencies
   yarn install
   
   # Configure environment variables
   # Edit .env file:
   # REACT_APP_BACKEND_URL=http://localhost:8001
   
   # Start the frontend development server
   yarn start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/api

---

## 📡 API Documentation

### Base URL
`http://localhost:8001/api` (local) 

### Endpoints

#### 1. **GET /** - Health Check
```bash
curl http://localhost:8001/api/
```
**Response:**
```json
{"message": "Mini Expense Tracker API"}
```

---

#### 2. **POST /expenses** - Create Expense
```bash
curl -X POST http://localhost:8001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250.50,
    "category": "Food",
    "date": "2025-06-03",
    "note": "Lunch at restaurant"
  }'
```
**Request Body:**
- `amount` (float, required): Positive number
- `category` (string, required): One of: Food, Transport, Bills, Entertainment, Other
- `date` (string, required): YYYY-MM-DD format, cannot be future date
- `note` (string, optional): Additional notes

**Response:**
```json
{
  "id": "uuid-string",
  "amount": 250.50,
  "category": "Food",
  "date": "2025-06-03",
  "note": "Lunch at restaurant",
  "created_at": "2025-06-03T12:00:00Z"
}
```

---

#### 3. **GET /expenses** - Get All Expenses (with filters)
```bash
# Get all expenses
curl http://localhost:8001/api/expenses

# Filter by category
curl "http://localhost:8001/api/expenses?category=Food"

# Filter by date range
curl "http://localhost:8001/api/expenses?date_from=2025-06-01&date_to=2025-06-30"

# Combine filters
curl "http://localhost:8001/api/expenses?category=Transport&date_from=2025-06-01"
```
**Query Parameters:**
- `category` (string, optional): Filter by category
- `date_from` (string, optional): Start date (YYYY-MM-DD)
- `date_to` (string, optional): End date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "uuid-1",
    "amount": 250.50,
    "category": "Food",
    "date": "2025-06-03",
    "note": "Lunch",
    "created_at": "2025-06-03T12:00:00Z"
  }
]
```

---

#### 4. **GET /expenses/summary** - Get Summary Statistics
```bash
curl http://localhost:8001/api/expenses/summary
```
**Response:**
```json
{
  "total_spent_this_month": 1200.50,
  "total_per_category": {
    "Food": 450.00,
    "Transport": 250.50,
    "Bills": 300.00,
    "Entertainment": 200.00
  },
  "highest_expense": {
    "id": "uuid",
    "amount": 500.00,
    "category": "Bills",
    "date": "2025-06-01",
    "note": "Electricity bill",
    "created_at": "2025-06-01T10:00:00Z"
  },
  "total_expenses": 15
}
```

---

#### 5. **PUT /expenses/{expense_id}** - Update Expense
```bash
curl -X PUT http://localhost:8001/api/expenses/{expense_id} \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 300.00,
    "note": "Updated note"
  }'
```
**Request Body:** (all fields optional)
- `amount` (float)
- `category` (string)
- `date` (string)
- `note` (string)

**Response:** Updated expense object

---

#### 6. **DELETE /expenses/{expense_id}** - Delete Expense
```bash
curl -X DELETE http://localhost:8001/api/expenses/{expense_id}
```
**Response:**
```json
{"message": "Expense deleted successfully"}
```

---

#### 7. **GET /expenses/export/csv** - Export as CSV
```bash
# Export all expenses
curl http://localhost:8001/api/expenses/export/csv -o expenses.csv

# Export filtered expenses
curl "http://localhost:8001/api/expenses/export/csv?category=Food&date_from=2025-06-01" -o expenses.csv
```
**Response:** CSV file download

---

## 🎨 UI/UX Features

### Design Highlights
- **Modern Gradient Design:** Eye-catching gradient backgrounds and card headers
- **Color-Coded Categories:** Each expense category has a unique icon and color
- **Responsive Layout:** Adapts seamlessly from mobile to desktop
- **Interactive Elements:** Hover effects, smooth transitions, and animations
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support

### User Experience
- **Quick Actions:** One-click filters for common date ranges
- **Visual Feedback:** Toast notifications for all actions (add, edit, delete, export)
- **Loading States:** Smooth loading indicators during API calls
- **Empty States:** Friendly messages encouraging user action
- **Confirmation Dialogs:** Prevent accidental deletions

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ Add expense with valid data
- ✅ Validate form errors (negative amount, future date, missing category)
- ✅ Edit existing expense
- ✅ Delete expense with confirmation
- ✅ Filter by category (Food, Transport, Bills, Entertainment, Other)
- ✅ Filter by date range (This Month, Last Month, Custom)
- ✅ Sort table by date, amount, category
- ✅ View summary statistics
- ✅ Toggle between pie and bar charts
- ✅ Export expenses to CSV
- ✅ Test responsive design on mobile

### Test the API
```bash
# Add test expense
curl -X POST http://localhost:8001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "category": "Food", "date": "2025-06-03", "note": "Test"}'

# Get all expenses
curl http://localhost:8001/api/expenses

# Get summary
curl http://localhost:8001/api/expenses/summary
```

---

## 📊 Data Model

### Expense Schema
```python
{
  "id": "string (UUID)",
  "amount": "float (positive)",
  "category": "string (Food|Transport|Bills|Entertainment|Other)",
  "date": "string (YYYY-MM-DD, not future)",
  "note": "string (optional)",
  "created_at": "datetime (ISO 8601)"
}
```

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=expense_tracker
CORS_ORIGINS=*
```

### Frontend Environment Variables (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## 🚦 Next Steps (Future Enhancements)

If I had more time, I would implement:

1. **User Authentication:** Multi-user support with JWT-based authentication
2. **Budget Management:** Set monthly budgets per category with alerts
3. **Recurring Expenses:** Support for recurring bills and subscriptions
4. **Advanced Analytics:** 
   - Month-over-month comparison
   - Trend analysis
   - Spending predictions
5. **Receipt Upload:** Attach receipt images to expenses
6. **Multi-Currency Support:** Support for multiple currencies with conversion
7. **Export Options:** PDF reports, Excel exports
8. **Dark Mode:** Theme toggle for better user experience
9. **Expense Categories:** Custom user-defined categories
10. **Search Functionality:** Full-text search across notes and categories
11. **Data Backup:** Automatic backups and data import/export
12. **Mobile App:** Native iOS/Android apps

---

## 🐛 Known Issues

- The "Total Spent This Month" calculation uses the current month at runtime. Expenses from past months won't be included.
- CSV export downloads with a generic filename. Future enhancement: include date range in filename.

---

## 👨‍💻 Development Notes



### Technical Decisions
- **MongoDB over JSON/SQLite:** Scalable, production-ready database
- **FastAPI over Express:** Type safety with Pydantic, automatic API docs
- **shadcn/ui over Material-UI:** Modern, customizable, and lightweight
- **Recharts:** Simple, declarative charting library with good documentation
- **UUID over ObjectId:** JSON-serializable IDs, easier to work with in REST APIs

---

## 📝 Submission Information

**Candidate:**  Amanjeet  
  B.Tech Computer Science & Engineering  
  Graphic Era Hill University
**Exercise:** Exercise 2 - Mini Expense Tracker  
**Submission Date:** June 4, 2025  
  

---

## 📄 License

This project was created as part of a Full Stack Developer assessment.

---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Recharts** for the charting library
- **Tailwind CSS** for the utility-first CSS framework
- **FastAPI** for the modern, fast web framework

---

## 📧 Contact

For questions or feedback about this project, please contact Amanjeet.

---

**Built  using React, FastAPI, MongoDB, and Tailwind CSS**

## Development Notes

AI tools were used for research, debugging assistance, and productivity during development. All code was reviewed, modified where necessary, tested locally, and understood before submission.
