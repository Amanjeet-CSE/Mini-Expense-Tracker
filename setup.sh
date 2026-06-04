#!/bin/bash

# Mini Expense Tracker - Setup Script
# This script sets up the entire project from scratch

echo "🚀 Mini Expense Tracker - Setup Script"
echo "========================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Check for MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please ensure MongoDB is running."
    echo "   You can install MongoDB from: https://www.mongodb.com/try/download/community"
fi

echo "✅ Prerequisites check passed!"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
MONGO_URL=mongodb://localhost:27017
DB_NAME=expense_tracker
CORS_ORIGINS=*
EOL
fi

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
yarn install

# Check .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
REACT_APP_BACKEND_URL=http://localhost:8001
EOL
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Start Backend: cd backend && source venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
echo "3. Start Frontend (in new terminal): cd frontend && yarn start"
echo "4. Open browser: http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
