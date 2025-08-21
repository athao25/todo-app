#!/bin/bash

# Todo App Entrypoint Script
# Starts both frontend (Vue.js) and backend (Flask) servers

set -e

echo "🚀 Starting Todo App servers..."

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on 127.0.0.1:5432"
    echo "Please start PostgreSQL and ensure database 'todo_db' exists:"
    echo "  createdb todo_db"
    exit 1
fi
echo "✅ PostgreSQL is running"

# Install backend dependencies if needed
echo "🐍 Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "📦 Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Setup PostgreSQL database and initialize with test data
echo "🗄️ Setting up PostgreSQL database and initializing test data..."
python setup_db.py

# Start backend server in background
echo "🌐 Starting Flask backend server on port 5001..."
python app.py &
BACKEND_PID=$!

# Install frontend dependencies and start frontend
echo "⚡ Setting up frontend..."
cd ../frontend
npm install

# Start frontend server in background
echo "🌐 Starting Vue.js frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Function to handle cleanup
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "✅ Both servers are starting up!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5001"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait