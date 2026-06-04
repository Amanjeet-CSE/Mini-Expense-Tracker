from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from decimal import Decimal
import io
import csv


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float = Field(gt=0, description="Expense amount must be positive")
    category: str = Field(description="Category: Food, Transport, Bills, Entertainment, Other")
    date: str = Field(description="Expense date in YYYY-MM-DD format")
    note: Optional[str] = Field(default="", description="Optional note")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        allowed = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other']
        if v not in allowed:
            raise ValueError(f'Category must be one of {allowed}')
        return v
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v):
        try:
            expense_date = datetime.fromisoformat(v).replace(tzinfo=timezone.utc)
            today = datetime.now(timezone.utc)
            if expense_date > today:
                raise ValueError('Date cannot be in the future')
        except ValueError as e:
            if 'future' in str(e):
                raise e
            raise ValueError('Invalid date format. Use YYYY-MM-DD')
        return v

class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)
    category: str
    date: str
    note: Optional[str] = ""

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = None
    date: Optional[str] = None
    note: Optional[str] = None

class ExpenseSummary(BaseModel):
    total_spent_this_month: float
    total_per_category: dict
    highest_expense: Optional[dict]
    total_expenses: int

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Mini Expense Tracker API"}

# Expense endpoints
@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate):
    expense = Expense(**expense_data.model_dump())
    
    doc = expense.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.expenses.insert_one(doc)
    return expense

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(
    category: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    query = {}
    
    if category:
        query['category'] = category
    
    if date_from or date_to:
        date_query = {}
        if date_from:
            date_query['$gte'] = date_from
        if date_to:
            date_query['$lte'] = date_to
        query['date'] = date_query
    
    expenses = await db.expenses.find(query, {"_id": 0}).to_list(1000)
    
    for expense in expenses:
        if isinstance(expense.get('created_at'), str):
            expense['created_at'] = datetime.fromisoformat(expense['created_at'])
    
    # Sort by date (newest first)
    expenses.sort(key=lambda x: x['date'], reverse=True)
    
    return expenses

@api_router.get("/expenses/summary", response_model=ExpenseSummary)
async def get_expenses_summary():
    now = datetime.now(timezone.utc)
    first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get all expenses
    all_expenses = await db.expenses.find({}, {"_id": 0}).to_list(1000)
    
    # Calculate total spent this month
    month_str = first_day_of_month.strftime('%Y-%m')
    month_expenses = [e for e in all_expenses if e['date'].startswith(month_str)]
    total_this_month = sum(e['amount'] for e in month_expenses)
    
    # Calculate per category
    category_totals = {}
    for expense in all_expenses:
        cat = expense['category']
        category_totals[cat] = category_totals.get(cat, 0) + expense['amount']
    
    # Find highest expense
    highest = None
    if all_expenses:
        highest = max(all_expenses, key=lambda x: x['amount'])
    
    return ExpenseSummary(
        total_spent_this_month=round(total_this_month, 2),
        total_per_category={k: round(v, 2) for k, v in category_totals.items()},
        highest_expense=highest,
        total_expenses=len(all_expenses)
    )

@api_router.put("/expenses/{expense_id}", response_model=Expense)
async def update_expense(expense_id: str, expense_update: ExpenseUpdate):
    # Check if expense exists
    existing = await db.expenses.find_one({"id": expense_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in expense_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.expenses.update_one({"id": expense_id}, {"$set": update_data})
    
    # Get updated expense
    updated = await db.expenses.find_one({"id": expense_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return Expense(**updated)

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    result = await db.expenses.delete_one({"id": expense_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

@api_router.get("/expenses/export/csv")
async def export_expenses_csv(
    category: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    query = {}
    
    if category:
        query['category'] = category
    
    if date_from or date_to:
        date_query = {}
        if date_from:
            date_query['$gte'] = date_from
        if date_to:
            date_query['$lte'] = date_to
        query['date'] = date_query
    
    expenses = await db.expenses.find(query, {"_id": 0}).to_list(1000)
    expenses.sort(key=lambda x: x['date'], reverse=True)
    
    # Create CSV
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['date', 'category', 'amount', 'note'])
    writer.writeheader()
    
    for expense in expenses:
        writer.writerow({
            'date': expense['date'],
            'category': expense['category'],
            'amount': expense['amount'],
            'note': expense.get('note', '')
        })
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=expenses.csv"}
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()